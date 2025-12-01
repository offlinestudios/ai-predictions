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
