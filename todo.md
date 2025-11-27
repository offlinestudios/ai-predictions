# AI Predictions Platform - TODO

## Database Schema
- [x] Create subscriptions table with tier levels (free, pro, premium)
- [x] Create predictions table to store user prediction history
- [x] Add subscription relationship to users table

## Backend API
- [x] Implement subscription management procedures (get current plan, upgrade/downgrade)
- [x] Implement prediction generation procedure with AI integration
- [x] Implement prediction history retrieval
- [x] Add subscription tier validation middleware

## Frontend UI
- [x] Design and implement landing page with subscription tiers
- [x] Create subscription pricing cards (free, pro, premium)
- [x] Build prediction input form interface
- [x] Create prediction results display component
- [x] Implement prediction history page
- [x] Add user dashboard with subscription status
- [x] Implement subscription upgrade/downgrade flow

## AI Integration
- [x] Integrate LLM API for generating predictions
- [x] Create prediction prompt templates
- [x] Implement rate limiting based on subscription tier

## Testing
- [x] Write vitest tests for subscription procedures
- [x] Write vitest tests for prediction generation
- [x] Test subscription tier restrictions

## Polish & Deployment
- [x] Review UI/UX and ensure responsive design
- [x] Test complete user flow
- [ ] Create checkpoint for deployment
