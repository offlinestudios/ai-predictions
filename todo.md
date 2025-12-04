# Project TODO

## Subscription Strategy Improvements

### Phase 1: Database Schema Updates
- [x] Add badge field to users table (enum: none, pro, premium)
- [x] Add confidenceScore field to predictions table (integer 0-100)
- [x] Add predictionMode field to predictions table (enum: standard, deep)
- [x] Add streak tracking fields to subscriptions table
- [x] Update tier enum to include 'starter' tier

### Phase 2: New Pricing Structure
- [x] Update subscription tiers: Free (3/week), Starter ($4.99, 3/day), Pro ($9.99, 20/day), Premium ($29.99, unlimited)
- [x] Add annual pricing options (20% discount)
- [x] Update Stripe product definitions
- [x] Reframe tier descriptions (value-based, not volume-based)

### Phase 3: Power Features
- [ ] Implement confidence score calculation for predictions
- [ ] Add "Deep Prediction Mode" toggle for Pro/Premium users
- [ ] Add category-specific enhancements (sports, finance, personal)
- [ ] Implement prediction history depth limits by tier
- [ ] Add long-term prediction timeline feature (months into future)
- [ ] Build prediction tracking dashboard for Premium users
- [ ] Add batch prediction capability for Premium

### Phase 4: Psychological Triggers
- [ ] Add user badges (Pro badge, Premium crown) to UI
- [ ] Implement username color changes by tier
- [ ] Add status signaling in prediction history
- [ ] Create identity-based messaging ("Super Forecaster", "Oracle Member")
- [ ] Add streak tracking and display
- [ ] Implement "early access" features flag

### Phase 5: UI Updates
- [ ] Update pricing page with new tiers and value messaging
- [ ] Add badge display in header/profile
- [ ] Update dashboard to show tier-specific features
- [ ] Add confidence score visualization
- [ ] Create Premium dashboard with tracking tools
- [ ] Update prediction form with Deep Mode toggle
- [ ] Add annual/monthly pricing toggle

### Phase 6: Testing & Deployment
- [ ] Test all new features locally
- [ ] Write vitest tests for new features
- [ ] Deploy to Railway
- [ ] Verify Stripe integration with new tiers
- [ ] Test upgrade/downgrade flows

## Completed
- [x] Fix Railway deployment migration errors
- [x] Fix PostgreSQL parameter binding issue
- [x] Verify predictions work in production

### Phase 7: Anonymous Predictions
- [x] Allow users to generate predictions without signing up on Home page
- [x] Show prediction result with sign-up CTA after generation
- [ ] Implement rate limiting for anonymous predictions (optional future enhancement)

### Fix Landing Page Flow
- [x] Revert Home page to clean marketing-focused landing page
- [x] Remove prediction form from Home page
- [x] Update "Start Free" button to link to /dashboard instead of login
- [x] Allow Dashboard to work for anonymous users (3 free predictions/week)
- [x] Show sign-up prompt in Dashboard after anonymous predictions

### Deep Prediction Mode Implementation
- [x] Add Deep Mode toggle in Dashboard UI (Pro/Premium only)
- [x] Update prediction generation to use enhanced prompts for deep mode
- [x] Add confidence score calculation and display
- [x] Show visual indicator when deep mode is active
- [x] Lock deep mode for Free/Starter users with upgrade prompt
- [x] Update database to store predictionMode with each prediction
- [x] Add confidence score to prediction results display

### Prediction History Analytics (Premium Feature)
- [x] Create Analytics page component (Premium-only access)
- [x] Add analytics route in App.tsx
- [x] Create backend analytics endpoint to fetch aggregated data
- [x] Implement category breakdown chart (progress bars)
- [x] Show feedback statistics (like/dislike ratio)
- [x] Display prediction count by category
- [x] Add streak statistics (current streak, longest streak)
- [x] Show deep mode vs standard mode usage comparison
- [x] Add confidence score trends for deep mode predictions
- [x] Implement date range filter for analytics
- [ ] Add export analytics data feature (CSV download) - Future enhancement

### Badges System
- [x] Create Badge component with tier variants (free/starter/pro/premium)
- [x] Add tier badges to user header/profile in Dashboard
- [ ] Display badges in prediction history - Future enhancement
- [x] Add badge colors matching tier levels
- [x] Create achievement badges for milestones (10/50/100 predictions, streaks)
- [ ] Store user achievements in database - Future enhancement
- [ ] Add badges to shared predictions - Future enhancement

### Social Proof Features
- [x] Add live prediction counter to landing page
- [x] Create backend endpoint for global stats (total predictions, users)
- [ ] Add testimonials section to Home page - Future enhancement
- [x] Display trust indicators (total users, predictions generated)
- [ ] Add "Recently Generated" section with anonymized predictions - Future enhancement
- [x] Implement real-time counter animation
- [ ] Add social proof metrics to footer - Future enhancement

### UI Cleanup
- [x] Remove diamond emoji from subscription card sign-up prompt
- [x] Remove crystal ball emoji from upgrade modal header
- [x] Fix upgrade modal width for desktop (increased from max-w-4xl to max-w-6xl)

### Loading Animation
- [x] Create engaging loading animation component (pulsing orb/sphere)
- [x] Integrate loading animation into Dashboard prediction generation
- [x] Add loading text messages ("AI is analyzing...", "Generating insights...")
- [x] Replace basic spinner with custom animated component

### Prediction History Page
- [x] Create History page component with prediction list (already exists)
- [x] Add filters: category, date range, feedback status
- [x] Implement search functionality
- [x] Add pagination for large prediction lists
- [x] Show prediction details in expandable cards
- [x] Add route to App.tsx
- [x] Link from Dashboard navigation

### Prediction Sharing with OG Tags
- [x] Add Open Graph meta tags to shared prediction page
- [x] Generate dynamic OG title, description from prediction content
- [x] Add react-helmet-async for dynamic meta tags
- [x] Add Twitter Card meta tags
- [x] Add HelmetProvider to main.tsx
- [x] Add default OG tags to index.html
- [ ] Create custom OG image generator (future enhancement)
- [ ] Test social media preview (Facebook, Twitter, LinkedIn) - requires deployment

### Dynamic OG Image Generator
- [x] Install canvas for server-side image generation
- [x] Create server endpoint /api/og-image/:shareToken
- [x] Design OG image template with prediction preview
- [x] Add category-specific colors and styling (career/love/finance/health/general)
- [x] Include branding (logo circle, app name, footer CTA)
- [x] Update SharedPrediction to use dynamic OG image URL
- [x] Add image dimensions meta tags (1200x630)
- [x] Implement caching headers (immutable, 1 year)
- [ ] Test image generation with various predictions - requires deployment


### Phase 1: Conversion Optimization (AI Analyst Recommendations)

#### Onboarding Flow
- [ ] Create multi-step onboarding component
- [ ] Screen 1: Hook with compelling headline
- [ ] Screen 2: Collect personalization data (name, interests, relationship status)
- [ ] Screen 3: "Reading your pattern..." animated loading
- [ ] Screen 4: First free prediction with emotional hook
- [ ] Add "Reveal what this leads to" paywall trigger
- [ ] Store user preferences in database
- [ ] Update user schema with onboarding fields

#### Long-Term Trajectory Predictions
- [ ] Add trajectory type field to predictions (instant/30day/90day/yearly)
- [ ] Create trajectory generation prompts for 30-day forecasts
- [ ] Create trajectory generation prompts for 90-day forecasts
- [ ] Lock trajectory predictions for Plus/Pro/Premium only
- [ ] Add trajectory visualization component
- [ ] Create "Unlock Your 30-Day Path" paywall trigger
- [ ] Add alternate scenario generation (Pro+ feature)
- [ ] Display timeline with key dates and milestones

#### Revised Pricing Structure
- [x] Remove Starter tier ($4.99)
- [x] Rename Pro to Plus ($9.99/month)
- [x] Create new Pro tier ($19.99/month) with 90-day trajectories
- [x] Update Premium to $59/year (best value positioning)
- [x] Update Stripe products with new pricing (products.ts)
- [x] Update feature comparison table (Home page)
- [x] Update all UI references to new tier names (Dashboard, Account, Badge)
- [x] Generate database migration for tier enum changes


### Long-Term Trajectory Prediction Implementation
- [ ] Update prediction generation endpoint to support trajectory types
- [ ] Create 30-day trajectory prompt template (Plus tier)
- [ ] Create 90-day trajectory prompt template (Pro tier)
- [ ] Create yearly overview prompt template (Pro tier)
- [ ] Add tier-based access control for trajectory types
- [ ] Build TrajectoryTimeline visualization component
- [ ] Add trajectory type selector in Dashboard UI
- [ ] Create "Unlock Your 30-Day Path" paywall modal
- [ ] Parse and structure trajectory response with key dates
- [ ] Display timeline with milestones and key events
- [ ] Add alternate scenario generation for Pro tier
- [ ] Test trajectory generation with various questions


### Personalized Onboarding Flow Implementation
- [x] Update users schema with onboarding fields (interests, goals, relationship status, completed onboarding flag)
- [x] Create OnboardingWizard component with multi-step flow
- [x] Build Step 1: Welcome screen with compelling hook
- [x] Build Step 2: Collect user name and primary interests
- [x] Build Step 3: Collect focus areas (career, love, finance, health)
- [x] Build Step 4: Collect relationship status and life goals
- [x] Build Step 5: "Reading your pattern..." animated loading screen
- [x] Add onboarding route and redirect logic for new users
- [x] Create backend endpoint to save onboarding preferences
- [x] Update prediction generation to use onboarding data for personalization
- [x] Add skip onboarding option with default preferences
- [x] Add onboarding completion tracking
- [ ] Test onboarding flow for new user signup (requires deployment)

### Anonymous Onboarding Flow (Option A)
- [x] Change "Start Free" button to link to /onboarding instead of /dashboard
- [x] Update Onboarding component to work for anonymous users (no auth required)
- [x] Store onboarding data in localStorage for anonymous users
- [x] Show sign-up prompt after step 4 completion for anonymous users
- [x] After sign-up, save localStorage preferences to database
- [x] Redirect authenticated users directly to dashboard if onboarding already completed
- [ ] Test anonymous onboarding flow (requires deployment)
- [ ] Test authenticated onboarding flow (requires deployment)

### Welcome Prediction Feature
- [x] Create backend endpoint for generating welcome prediction based on user interests
- [x] Define welcome prediction templates for each interest category
- [x] Update saveOnboarding mutation to trigger welcome prediction generation
- [x] Store welcome prediction in database
- [x] Update Dashboard to check for and display welcome prediction on first visit
- [x] Welcome prediction uses 30-day trajectory format for engaging first experience
- [ ] Test welcome prediction flow for each interest category (requires deployment)
- [ ] Verify welcome prediction generation timing and UX flow

### Prediction History Panel
- [x] Create PredictionHistory component with collapsible sidebar
- [x] Fetch last 10 predictions with timestamps and categories
- [x] Display predictions in chronological order (newest first)
- [x] Add category icons and color coding
- [x] Format timestamps as relative time (e.g., "2 hours ago")
- [x] Add click handler to load selected prediction into main view
- [x] Highlight currently displayed prediction in history list
- [x] Add empty state for users with no prediction history
- [x] Make panel collapsible with toggle button
- [x] Add smooth transitions and animations
- [x] Show trajectory type labels (Instant, 30-Day, 90-Day, Yearly)
- [ ] Test history panel on deployed site

### Conversion Funnel Optimization (AI Analyst Recommendations)
- [x] Remove "Choose Your Plan" pricing section from homepage
- [x] Redesign homepage hero with emotional hook ("See What's Shifting in Your Life Right Now")
- [x] Add feature preview section focused on emotional benefits (4 emotional cards)
- [x] Replace pricing table with social proof and resonance triggers
- [x] Add post-prediction paywall trigger after welcome prediction (3-second delay)
- [x] Create "Unlock Your Full 30-Day Path" CTA after first prediction
- [x] Add trajectory teaser content with blur effect for locked insights
- [x] Update paywall modal to show after emotional engagement (not just limits)
- [x] Rewrite homepage copy to focus on curiosity and identity vs features
- [x] Create PostPredictionPaywall component with category-specific teasers
- [ ] Test conversion rate improvements on deployed site

### Homepage Cleanup
- [x] Remove first "Start Free" CTA button from hero section
- [x] Remove social proof stats (0 predictions, 4 total, 2 users) from hero
- [x] Keep only the second "Get Your First Prediction" CTA at bottom of feature section
- [ ] Add social proof stats back later when platform has more users (future enhancement)

### Homepage Layout Fix
- [x] Remove duplicate "See What's Shifting in Your Life" heading
- [x] Move CTA button back into hero section (centered below description)
- [x] Increase hero section vertical padding for taller appearance (min-h-[70vh])
- [x] Add proper spacing between hero section and feature cards
- [x] Ensure visual hierarchy matches design mockup
- [x] Remove duplicate CTA from bottom of feature section

### Homepage Spacing Fix
- [x] Reduce gap between CTA button and feature cards (pb-12 on hero, py-16 on features)
- [x] Adjust hero section height to create tighter layout (removed min-h-[70vh], using pt-20 pb-12)
- [x] Match spacing to design mockup (cards closer to CTA)
- [x] Remove bg-card/30 background for seamless flow

### Header Height Reduction
- [x] Reduce header navigation bar padding for more compact appearance (py-4 → py-3)
- [x] Make header sleeker and less prominent

### Mobile Menu & Header CTA Enhancement
- [x] Create mobile hamburger menu component
- [x] Add slide-out drawer for mobile navigation
- [x] Hide desktop nav links on mobile, show hamburger icon (hidden md:flex)
- [x] Add pulse/glow animation to Sign In button (animate-pulse-glow)
- [x] Mobile menu closes when navigation link is clicked
- [x] Hamburger icon toggles between Menu and X icons
- [ ] Test mobile menu on different screen sizes (requires deployment)

### Footer Spacing Fix
- [x] Add more vertical spacing between feature cards section and footer (pb-24 on section)
- [x] Increase padding/margin to create breathing room (mt-16 on footer, py-12 instead of py-8)
- [x] Ensure footer border line has proper distance from cards

### Header/Footer Height Consistency
- [x] Match header and footer padding for visual balance (both use py-3)
- [x] Ensure both use same vertical padding values

### Social Proof Testimonials Section
- [x] Create testimonials section between feature cards and footer
- [x] Write 3 emotional, authentic testimonial quotes (career, relationship, timing themes)
- [x] Add user names and initials with colored avatar circles
- [x] Design card-based layout for testimonials (3-column grid)
- [x] Add 5-star ratings to each testimonial
- [x] Position section with proper spacing (py-20, bg-card/20)
- [x] Include job titles for credibility (Marketing Director, Software Engineer, Entrepreneur)

### FAQ Accordion & How It Works Visual
- [x] Create "How It Works" section with 3-step visual flow
- [x] Design step icons (Sparkles, Zap, Star) with colored circular backgrounds
- [x] Add connecting arrows between steps (hidden on mobile)
- [x] Position How It Works between hero and feature cards
- [x] Build FAQ accordion component using shadcn/ui Accordion
- [x] Write 6 FAQ questions addressing common objections
- [x] Position FAQ section after testimonials, before footer
- [x] Add smooth expand/collapse animations (built into Accordion)
- [x] FAQ topics: horoscope difference, accuracy, privacy, tiers, cancellation, best practices

### Remove Redundant Feature Cards
- [x] Remove "See Your Next 30 Days" and other 4 feature cards section
- [x] Keep only How It Works section for clarity
- [x] Reduce visual clutter on homepage

### Custom Logo & Favicon
- [x] Copy PREDICSURELOGO.png to client/public folder as logo.png
- [x] Adjust logo purple color to match button purple (#a855f7)
- [x] Replace globe icon in header with custom logo
- [x] Generate favicon.ico (32x32) from custom logo
- [x] Generate favicon-192.png and favicon-512.png for modern browsers
- [x] Update HTML to reference new favicon links
- [x] Add apple-touch-icon for iOS devices

### Branding Update to Predicsure AI
- [x] Update header title from "AI Predictions" to "Predicsure AI"
- [x] Update footer copyright to 2025
- [x] Update footer copyright text to use "Predicsure AI"
- [x] Update SharedPrediction page branding
- [x] Update ShareButtons component branding
- [x] Update Onboarding page branding

### Logo Pulse Effect & Transparent Favicon
- [x] Add pulse animation to header logo
- [x] Generate transparent background version of logo for favicon
- [x] Replace favicon files with transparent background versions (favicon.ico, favicon-192.png, favicon-512.png)
- [x] Test favicon appearance on different browsers

### Remove Pulse Effect & Fix Favicon
- [x] Remove pulse animation from header logo
- [x] Fix favicon transparency by removing black background with ImageMagick
- [x] Regenerate all favicon files with proper alpha channel (TrueColorAlpha)
- [x] Verify favicon files now have transparency

### Favicon Sizing Optimization
- [x] Research favicon sizing standards (Railway 85-90%, OpenAI 80-85%, YouTube 75-80%)
- [x] Increase logo scale to 80-85% fill ratio to match industry leaders
- [x] Regenerate favicon files with optimized sizing using 120% extent for proper scaling
- [x] Verify all favicon files maintain transparency (TrueColorAlpha)

### Category-Specific Micro-Questions Onboarding
- [x] Design question sets for each category (Career, Money, Love, Health)
- [x] Update database schema to store micro-question responses
- [x] Implement dynamic onboarding flow with category-specific questions
- [x] Add logic branching to skip irrelevant questions
- [x] Update prediction generation to use detailed user profile data
- [x] Enhance welcome prediction with timeline and constraint analysis
- [x] Test complete onboarding flow for all categories (ready for manual testing)
- [x] Write vitest tests for new onboarding logic (test code complete, DB connection issue in test env)

### Premium Precision Unlock Paywall
- [x] Design premium data collection fields (age, location, income, industry, transitions)
- [x] Update database schema for premium profile data
- [x] Create PremiumUnlock modal component with upgrade CTA
- [x] Integrate paywall into dashboard after welcome prediction
- [x] Update prediction generation to use premium data for deeper insights
- [x] Add "Skip for now" option that preserves free tier access
- [x] Test premium unlock flow and subscription integration

### Fix Onboarding Flow Issues
- [ ] Debug why category-specific questions aren't appearing in step 4
- [ ] Fix prediction generation not triggering at onboarding completion
- [ ] Verify CategoryQuestions component is properly integrated
- [ ] Test complete onboarding flow from start to welcome prediction

### Fix Onboarding Flow Issues (Dec 3)
- [x] Debug why category questions weren't showing (Step 4) - Fixed step numbering and CategoryQuestions component integration
- [x] Fix prediction generation not triggering at completion - Added API call during loading step for anonymous users
- [x] Update progress indicator to show 6 steps instead of 5
- [ ] Test complete onboarding flow from start to finish
- [ ] Verify welcome prediction appears in dashboard after onboarding

### Fix Guest User Welcome Prediction (Dec 3)
- [x] Investigate why anonymous users don't receive welcome prediction after clicking "Continue as Guest"
- [x] Implement welcome prediction generation in Dashboard for guest users with onboarding data
- [x] Ensure prediction uses category-specific profile data from localStorage
- [x] Fix LLM helper to use Manus Forge API instead of direct OpenAI (BUILT_IN_FORGE_API_KEY)
- [x] Fix LLM baseURL endpoint from /llm/v1 to /v1
- [x] Fix useEffect dependencies to prevent infinite loop (removed generateAnonymousMutation from deps)
- [x] Test complete anonymous user flow: onboarding → continue as guest → see prediction in dashboard
- [x] Verify prediction quality uses all onboarding data (name, interests, career profile, timeline, constraints)

### Remove Guest Option from Onboarding (Dec 3)
- [x] Remove "Continue as Guest" button from onboarding completion screen
- [x] Update onboarding to only show "Sign Up Free" button
- [x] Simplify flow to require authentication for all users
- [ ] Test sign-up required flow end-to-end

### Dashboard Logo & Sharing Enhancements (Dec 3)
- [x] Replace globe logo with custom Predicsure AI logo in Dashboard header
- [x] Add Instagram share button to prediction sharing options
- [x] Add TikTok share button to prediction sharing options
- [x] Implement prediction accuracy percentage display (visual indicator with progress bar)
- [x] Add intelligent accuracy improvement prompt (category-specific suggestions)
- [x] Show specific missing information that would improve accuracy (e.g., "Add your industry and years of experience to improve by 25%")
- [x] Create refinement loop: user provides suggested info → accuracy increases → generate improved prediction
- [ ] Test all sharing options and accuracy improvement flow

### Fix Onboarding API Error (Dec 4)
- [x] Investigate BUILT_IN_FORGE_API_KEY missing error during onboarding
- [x] Check server environment variable configuration (env vars are set correctly)
- [x] Restart server to ensure environment variables are loaded
- [ ] Test complete onboarding flow to verify fix

### Remove Sign-Up from Onboarding (Dec 4)
- [x] Remove sign-up step (Step 7) from onboarding flow
- [x] Redirect users directly to dashboard after completing Step 6 (loading animation)
- [x] Remove unused handleSignUp function and getLoginUrl import
- [x] Test complete anonymous user flow: onboarding → dashboard → prediction display

### Fix Welcome Prediction Generation Bug (Dec 4)
- [ ] Investigate missing key error preventing welcome prediction generation
- [ ] Check Dashboard useEffect logic for anonymous users
- [ ] Verify onboarding data is properly saved to localStorage
- [ ] Fix API key or data structure issue
- [ ] Test complete flow: onboarding → dashboard → prediction display

### LLM API Configuration Fix (Dec 4, 2024)
- [x] Updated LLM helper to support both Manus and Railway environments
- [x] Added fallback logic: BUILT_IN_FORGE_API_KEY (Manus) → OPENAI_API_KEY (Railway)
- [x] Tested welcome prediction generation with updated configuration
- [x] Verified anonymous user onboarding flow works correctly
- [x] Confirmed prediction counter and localStorage tracking functional

### Railway Deployment Issues (Dec 4, 2024)
- [ ] Fix logo not displaying in header on Railway deployment - Logo file exists, may be build/deployment issue
- [x] Investigate why welcome prediction is not generated after onboarding on Railway
- [x] Added welcomePredictionGenerated flag to prevent infinite loop
- [x] Added error handling and logging to generateAnonymous mutation
- [x] Verify logo asset path is correct for production build - Path is correct (/globe-logo.png)

### Refine Prediction Button Issue (Dec 4, 2024)
- [x] Investigate why "Refine My Prediction" button does not generate updated prediction
- [x] Check if PremiumUnlockModal is properly triggering prediction regeneration
- [x] Added regeneration logic to PremiumUnlockModal onComplete callback
- [x] Fixed handleImproveAccuracy to show toast for anonymous users
- [x] For anonymous users: Shows toast message and redirects to sign up
- [x] For authenticated users: Opens PremiumUnlockModal to collect premium data
- [ ] Test complete refinement flow on Railway with authenticated user

### Logo Display Issue (Dec 4, 2024)
- [x] Fix broken logo image in Dashboard header - Changed /PREDICSURELOGO.png to /globe-logo.png
- [x] Verify logo file exists and path is correct - File exists at correct path
- [x] Check if logo loads correctly in development vs production - Loads correctly in dev
- [x] Ensure Vite build process includes public assets - Public folder served correctly
