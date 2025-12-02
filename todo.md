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
