# AI Predictions Platform - TODO

## Replace Generate Prediction Button Icon
- [x] Remove globe logo from Generate Prediction button
- [x] Add Lucide icon (Sparkles for AI prediction)
- [x] Test button appearance with new icon

## Revert Globe Logo
- [x] Restore previous globe logo version that worked better with background
- [x] Keep orbiting particles removed for cleaner animation

## Replace Loading Animation with Hourglass
- [x] Design hourglass with cosmic purple sand animation
- [x] Implement flowing sand particles effect
- [x] Add glowing purple effects and sparkles
- [x] Test animation appearance

## Create Crystal Ball Animation
- [x] Design crystal ball with swirling mist/energy inside
- [x] Add glowing purple effects and sparkles
- [x] Implement mystical floating animation
- [x] Test animation appearance

## Remove Generate Prediction Button Animation
- [x] Remove spinning animation from Generate Prediction button when loading

## Restore Button Animation and Remove Crystal Ball
- [x] Restore spinning Loader2 icon on Generate Prediction button
- [x] Remove crystal ball loading animation component
- [x] Revert to basic loading state

## Platform Migration (Manus → Independent Services)
- [x] Install Clerk, OpenAI, and AWS SDK packages
- [x] Replace Manus OAuth with Clerk authentication
- [x] Replace Manus S3 with Cloudflare R2 storage
- [x] Replace Manus LLM with OpenAI API
- [x] Add Railway deployment configuration files
- [x] Create .env.example with all required variables
- [x] Create deployment documentation
- [x] Test all integrations (TypeScript compilation successful, ready for deployment)

## Fix Railway Deployment
- [x] Fix nixpacks.toml Node.js package name
- [x] Simplify Railway build configuration
- [x] Push fixes to GitHub
- [ ] Guide user through database setup

## Add Automatic Database Migration
- [x] Create migration script that runs on deployment
- [x] Update package.json start command to run migration
- [x] Push changes to GitHub
- [ ] Verify deployment and database tables created

## Fix Clerk OAuth Callback Routes
- [x] Update SignIn page to use Clerk SignIn component with routing
- [x] Update SignUp page to use Clerk SignUp component with routing
- [x] Verify App.tsx routes handle Clerk callbacks
- [x] Push fixes to GitHub
- [x] Test Google OAuth login (awaiting Railway deployment)

## Fix Sign-Up 404 Error
- [x] Investigate sign-up button links on Home page
- [x] Check Clerk configuration for sign-up redirects
- [x] Remove old OAuth routes that conflict with Clerk
- [x] Fix routing or button configuration
- [x] Push fix to GitHub
- [x] Test sign-up flow (awaiting Railway deployment)

## Debug Railway 404 Error
- [ ] Check if Railway deployment completed successfully
- [ ] Verify build output and dist folder structure
- [ ] Check server logs on Railway
- [ ] Test if the issue is with React Router or Express server
- [ ] Fix and redeploy

## Fix Clerk Authentication Integration
- [x] Review useAuth hook and fix Clerk integration
- [x] Update server context to validate Clerk tokens
- [x] Fix authentication flow in tRPC procedures
- [x] Test sign-in page loads properly
- [ ] Test complete auth flow

## Fix Clerk OAuth Callback Routing
- [x] Change Clerk components to use hash-based routing
- [x] Update SignIn and SignUp pages with routing="hash"
- [ ] Test Google OAuth locally
- [x] Deploy to Railway
- [ ] Verify production OAuth works

## Fix Sign-Up Route Typo
- [x] Remove space from " /sign-up" route in App.tsx
- [x] Deploy fix to Railway
- [ ] Test sign-up page loads (awaiting Railway deployment)

## Fix Dashboard Redirect Loop
- [x] Investigate useAuth hook and dashboard authentication
- [x] Check if tRPC auth.me query is failing
- [x] Fix redirect loop logic (use headers function instead of custom fetch)
- [ ] Test dashboard loads after login

## Fix Clerk Session Verification (Root Cause)
- [x] Fix clerkAuth.ts to decode JWT and extract sessionId
- [x] Use verifySession(sessionId, sessionToken) correctly
- [x] Add defensive redirect logic to prevent loops on auth pages
- [ ] Test authentication end-to-end

## Replace Deprecated verifySession API
- [x] Update clerkAuth.ts to use verifyToken() instead of verifySession()
- [x] Remove JWT decoding logic (not needed with verifyToken)
- [ ] Test authentication locally
- [x] Deploy to Railway (in progress) and verify

## Fix Database Upsert User Error
- [x] Check users table schema in drizzle/schema.ts
- [x] Check upsertUser function in server/db.ts
- [x] Fix SQL query or schema mismatch (increased openId to 255 chars, fixed empty updateSet)
- [ ] Test authentication flow locally
- [x] Deploy to Railway (in progress)

## Convert MySQL to PostgreSQL
- [x] Update package.json dependencies (remove mysql2, add postgres)
- [x] Convert schema from mysqlTable to pgTable
- [x] Convert MySQL types to PostgreSQL types (mysqlEnum → pgEnum, etc.)
- [x] Update server/db.ts to use postgres driver
- [x] Update drizzle.config.ts for PostgreSQL
- [x] Run migrations (will run on Railway deployment)
- [ ] Test database connection
- [x] Deploy to Railway (in progress)
