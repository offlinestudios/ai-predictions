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
- [x] Create checkpoint for deployment

## Typography Update
- [x] Replace fonts with modern, futuristic style
- [x] Update CSS with new font families
- [x] Test typography across all pages

## Icon Update
- [x] Replace sparkles icon with crystal ball in header
- [x] Update pricing section icons to crystal ball
- [x] Update all page headers to use crystal ball

## Crystal Ball Icon Fixes
- [x] Remove duplicate circle icon in pricing card "Most Popular" badge
- [x] Add 3D gradient effect to crystal ball
- [x] Add shadow/glow to create depth
- [x] Update all crystal ball instances with new 3D design

## Globe Icon Redesign
- [x] Replace crystal ball with globe/world design
- [x] Add continent outlines (World Cup trophy style)
- [x] Maintain 3D sphere appearance with proper shading
- [x] Update CrystalBall component with new globe design

## Globe Icon Refinement & Pricing Icons
- [x] Update globe with bold, realistic continent shapes (Americas, Africa, Europe)
- [x] Add trophy/pedestal base to globe design
- [x] Use different icons for pricing tiers (not globe)
- [x] Keep existing Zap (Pro) and Crown (Premium) icons

## Globe Logo Update to Match Reference
- [x] Redesign globe with exact continent shapes from reference
- [x] Add prominent trophy/hands base (full silhouette)
- [x] Ensure high contrast bold design
- [x] Match World Cup trophy aesthetic exactly

## Use Image File for Logo
- [x] Copy globe trophy image to public folder
- [x] Replace CrystalBall component with img element in headers
- [x] Ensure proper sizing and styling

## Purple Globe Logo Design
- [x] Generate glowing globe with purple color palette
- [x] Replace current globe trophy logo with purple globe
- [x] Update all logo references across the site

## Add Glow Effect to Logo
- [x] Add CSS drop-shadow/filter to make logo glow
- [x] Apply glow effect to all logo instances
- [x] Test glow visibility on dark background
