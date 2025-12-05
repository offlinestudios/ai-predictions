/**
 * Sports Data Integration using The Sports DB API (Free)
 * API Documentation: https://www.thesportsdb.com/api.php
 * 
 * Free tier includes:
 * - Team information and stats
 * - League data
 * - Player information
 * - Event/game results
 * - No rate limits on free tier
 */

interface TeamInfo {
  name: string;
  league: string;
  formed?: string;
  stadium?: string;
  description?: string;
}

interface GameResult {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  status: string;
}

interface SportsContext {
  teams?: TeamInfo[];
  recentGames?: GameResult[];
  league?: string;
  error?: string;
}

// In-memory cache to reduce API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Fetch team information by name
 */
export async function searchTeam(teamName: string): Promise<TeamInfo | null> {
  const cacheKey = `team:${teamName.toLowerCase()}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
    );
    
    if (!response.ok) {
      console.error(`[Sports API] Failed to fetch team: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.teams || data.teams.length === 0) {
      return null;
    }

    const team = data.teams[0];
    const teamInfo: TeamInfo = {
      name: team.strTeam,
      league: team.strLeague,
      formed: team.intFormedYear,
      stadium: team.strStadium,
      description: team.strDescriptionEN,
    };

    // Cache the result
    cache.set(cacheKey, { data: teamInfo, timestamp: Date.now() });

    return teamInfo;
  } catch (error) {
    console.error('[Sports API] Error fetching team:', error);
    return null;
  }
}

/**
 * Fetch recent games for a team
 */
export async function getTeamRecentGames(teamName: string, limit: number = 5): Promise<GameResult[]> {
  const cacheKey = `games:${teamName.toLowerCase()}:${limit}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // First, get team ID
    const teamResponse = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
    );
    
    if (!teamResponse.ok) {
      return [];
    }

    const teamData = await teamResponse.json();
    if (!teamData.teams || teamData.teams.length === 0) {
      return [];
    }

    const teamId = teamData.teams[0].idTeam;

    // Fetch last 5 events for the team
    const eventsResponse = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`
    );

    if (!eventsResponse.ok) {
      return [];
    }

    const eventsData = await eventsResponse.json();
    
    if (!eventsData.results) {
      return [];
    }

    const games: GameResult[] = eventsData.results.slice(0, limit).map((event: any) => ({
      date: event.dateEvent,
      homeTeam: event.strHomeTeam,
      awayTeam: event.strAwayTeam,
      homeScore: event.intHomeScore,
      awayScore: event.intAwayScore,
      status: event.strStatus,
    }));

    // Cache the result
    cache.set(cacheKey, { data: games, timestamp: Date.now() });

    return games;
  } catch (error) {
    console.error('[Sports API] Error fetching recent games:', error);
    return [];
  }
}

/**
 * Get sports context for prediction enrichment
 * Extracts team names from user input and fetches relevant data
 */
export async function getSportsContext(userInput: string): Promise<SportsContext> {
  try {
    // Simple team name extraction (can be improved with NLP)
    // Look for common team names or patterns like "Team A vs Team B"
    const vsMatch = userInput.match(/(\w+(?:\s+\w+)?)\s+(?:vs|versus|against)\s+(\w+(?:\s+\w+)?)/i);
    
    if (vsMatch) {
      const [, team1Name, team2Name] = vsMatch;
      
      // Fetch both teams in parallel
      const [team1, team2] = await Promise.all([
        searchTeam(team1Name),
        searchTeam(team2Name),
      ]);

      const teams: TeamInfo[] = [];
      if (team1) teams.push(team1);
      if (team2) teams.push(team2);

      // Fetch recent games for first team
      let recentGames: GameResult[] = [];
      if (team1) {
        recentGames = await getTeamRecentGames(team1Name, 3);
      }

      return {
        teams,
        recentGames,
        league: team1?.league || team2?.league,
      };
    }

    // Try to extract a single team name
    const teamMatch = userInput.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/);
    if (teamMatch) {
      const teamName = teamMatch[1];
      const team = await searchTeam(teamName);
      
      if (team) {
        const recentGames = await getTeamRecentGames(teamName, 3);
        return {
          teams: [team],
          recentGames,
          league: team.league,
        };
      }
    }

    return {};
  } catch (error) {
    console.error('[Sports API] Error getting sports context:', error);
    return { error: 'Failed to fetch sports data' };
  }
}

/**
 * Format sports context for LLM prompt
 */
export function formatSportsContext(context: SportsContext): string {
  if (!context.teams || context.teams.length === 0) {
    return '';
  }

  let formatted = '\n\n**Real-Time Sports Data:**\n';

  // Add team information
  context.teams.forEach((team, index) => {
    formatted += `\n**${team.name}** (${team.league}):\n`;
    if (team.stadium) formatted += `- Stadium: ${team.stadium}\n`;
    if (team.formed) formatted += `- Founded: ${team.formed}\n`;
  });

  // Add recent games
  if (context.recentGames && context.recentGames.length > 0) {
    formatted += `\n**Recent Games:**\n`;
    context.recentGames.forEach((game) => {
      const score = game.homeScore && game.awayScore 
        ? `${game.homeScore}-${game.awayScore}` 
        : 'TBD';
      formatted += `- ${game.date}: ${game.homeTeam} vs ${game.awayTeam} (${score})\n`;
    });
  }

  formatted += `\n**Use this real-time data to:**\n`;
  formatted += `- Provide data-driven predictions based on recent performance\n`;
  formatted += `- Reference specific game results and trends\n`;
  formatted += `- Make your prediction more credible and specific\n`;

  return formatted;
}
