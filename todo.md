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
