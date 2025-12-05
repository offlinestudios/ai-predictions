/**
 * Stocks & Market Data Integration using Alpha Vantage API (Free)
 * API Documentation: https://www.alphavantage.co/documentation/
 * 
 * Free tier includes:
 * - 25 API requests per day
 * - Real-time and historical stock data
 * - Technical indicators
 * - Company fundamentals
 * 
 * Rate limit: 25 calls/day (very limited, so we cache aggressively)
 */

interface StockQuote {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  volume: string;
  lastUpdated: string;
}

interface CompanyInfo {
  symbol: string;
  name: string;
  description?: string;
  sector?: string;
  industry?: string;
  marketCap?: string;
}

interface StocksContext {
  quotes?: StockQuote[];
  companies?: CompanyInfo[];
  marketStatus?: string;
  error?: string;
}

// In-memory cache to reduce API calls (critical for 25/day limit)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours (longer cache due to strict rate limits)

// Get API key from environment
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

/**
 * Fetch real-time stock quote
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  const cacheKey = `quote:${symbol.toUpperCase()}`;
  
  // Check cache first (critical for rate limits)
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Stocks API] Using cached quote for ${symbol}`);
    return cached.data;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    console.log(`[Stocks API] Fetching quote for ${symbol}...`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`[Stocks API] Failed to fetch quote: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    // Check for API errors
    if (data['Error Message']) {
      console.error(`[Stocks API] API Error: ${data['Error Message']}`);
      return null;
    }

    if (data['Note']) {
      console.warn(`[Stocks API] Rate limit warning: ${data['Note']}`);
      return null;
    }

    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      console.error(`[Stocks API] No quote data found for ${symbol}`);
      return null;
    }

    const stockQuote: StockQuote = {
      symbol: quote['01. symbol'],
      price: quote['05. price'],
      change: quote['09. change'],
      changePercent: quote['10. change percent'],
      volume: quote['06. volume'],
      lastUpdated: quote['07. latest trading day'],
    };

    // Cache the result (longer TTL due to rate limits)
    cache.set(cacheKey, { data: stockQuote, timestamp: Date.now() });
    console.log(`[Stocks API] Successfully fetched and cached quote for ${symbol}`);

    return stockQuote;
  } catch (error) {
    console.error('[Stocks API] Error fetching stock quote:', error);
    return null;
  }
}

/**
 * Fetch company overview/fundamentals
 */
export async function getCompanyInfo(symbol: string): Promise<CompanyInfo | null> {
  const cacheKey = `company:${symbol.toUpperCase()}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Stocks API] Using cached company info for ${symbol}`);
    return cached.data;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`;
    console.log(`[Stocks API] Fetching company info for ${symbol}...`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`[Stocks API] Failed to fetch company info: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    // Check for API errors
    if (data['Error Message'] || !data['Symbol']) {
      console.error(`[Stocks API] No company data found for ${symbol}`);
      return null;
    }

    if (data['Note']) {
      console.warn(`[Stocks API] Rate limit warning: ${data['Note']}`);
      return null;
    }

    const companyInfo: CompanyInfo = {
      symbol: data['Symbol'],
      name: data['Name'],
      description: data['Description'],
      sector: data['Sector'],
      industry: data['Industry'],
      marketCap: data['MarketCapitalization'],
    };

    // Cache the result
    cache.set(cacheKey, { data: companyInfo, timestamp: Date.now() });
    console.log(`[Stocks API] Successfully fetched and cached company info for ${symbol}`);

    return companyInfo;
  } catch (error) {
    console.error('[Stocks API] Error fetching company info:', error);
    return null;
  }
}

/**
 * Extract stock symbols from user input
 * Looks for common patterns like: $AAPL, TSLA, "Apple stock", etc.
 */
function extractStockSymbols(userInput: string): string[] {
  const symbols: string[] = [];
  
  // Match $SYMBOL pattern
  const dollarMatches = userInput.match(/\$([A-Z]{1,5})\b/g);
  if (dollarMatches) {
    symbols.push(...dollarMatches.map(m => m.substring(1)));
  }
  
  // Match standalone uppercase 1-5 letter symbols
  const symbolMatches = userInput.match(/\b([A-Z]{1,5})\b/g);
  if (symbolMatches) {
    // Filter out common words that aren't stock symbols
    const filtered = symbolMatches.filter(s => 
      s.length >= 2 && !['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'ITS', 'MAY', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WHO', 'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE'].includes(s)
    );
    symbols.push(...filtered);
  }
  
  // Remove duplicates
  return Array.from(new Set(symbols));
}

/**
 * Get stocks context for prediction enrichment
 */
export async function getStocksContext(userInput: string): Promise<StocksContext> {
  try {
    const symbols = extractStockSymbols(userInput);
    
    if (symbols.length === 0) {
      return {};
    }

    console.log(`[Stocks API] Extracted symbols: ${symbols.join(', ')}`);

    // Limit to 2 symbols to conserve API calls (25/day limit)
    const limitedSymbols = symbols.slice(0, 2);

    // Fetch quotes for all symbols
    const quotes = await Promise.all(
      limitedSymbols.map(symbol => getStockQuote(symbol))
    );

    // Fetch company info for first symbol only (to save API calls)
    const companies = limitedSymbols.length > 0 
      ? [await getCompanyInfo(limitedSymbols[0])]
      : [];

    // Filter out null results
    const validQuotes = quotes.filter((q): q is StockQuote => q !== null);
    const validCompanies = companies.filter((c): c is CompanyInfo => c !== null);

    // Determine market status (simple check based on time)
    const now = new Date();
    const hour = now.getUTCHours();
    const day = now.getUTCDay();
    const isWeekend = day === 0 || day === 6;
    const isMarketHours = hour >= 14 && hour < 21; // Rough US market hours in UTC
    const marketStatus = isWeekend ? 'closed (weekend)' : isMarketHours ? 'open' : 'closed';

    return {
      quotes: validQuotes.length > 0 ? validQuotes : undefined,
      companies: validCompanies.length > 0 ? validCompanies : undefined,
      marketStatus,
    };
  } catch (error) {
    console.error('[Stocks API] Error getting stocks context:', error);
    return { error: 'Failed to fetch stock data' };
  }
}

/**
 * Format stocks context for LLM prompt
 */
export function formatStocksContext(context: StocksContext): string {
  if (!context.quotes || context.quotes.length === 0) {
    return '';
  }

  let formatted = '\n\n**Real-Time Market Data:**\n';

  // Add market status
  if (context.marketStatus) {
    formatted += `\n**Market Status:** ${context.marketStatus}\n`;
  }

  // Add stock quotes
  context.quotes.forEach((quote) => {
    const changeSign = parseFloat(quote.change) >= 0 ? '+' : '';
    formatted += `\n**${quote.symbol}** - $${quote.price}\n`;
    formatted += `- Change: ${changeSign}${quote.change} (${quote.changePercent})\n`;
    formatted += `- Volume: ${parseInt(quote.volume).toLocaleString()}\n`;
    formatted += `- Last Updated: ${quote.lastUpdated}\n`;
  });

  // Add company information
  if (context.companies && context.companies.length > 0) {
    formatted += `\n**Company Information:**\n`;
    context.companies.forEach((company) => {
      formatted += `\n**${company.name}** (${company.symbol}):\n`;
      if (company.sector) formatted += `- Sector: ${company.sector}\n`;
      if (company.industry) formatted += `- Industry: ${company.industry}\n`;
      if (company.marketCap) {
        const marketCapBillions = (parseInt(company.marketCap) / 1e9).toFixed(2);
        formatted += `- Market Cap: $${marketCapBillions}B\n`;
      }
    });
  }

  formatted += `\n**Use this real-time data to:**\n`;
  formatted += `- Provide data-driven predictions based on current market conditions\n`;
  formatted += `- Reference specific price movements and trends\n`;
  formatted += `- Make your prediction more credible and actionable\n`;

  return formatted;
}
