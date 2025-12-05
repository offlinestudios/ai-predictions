# Environment Variables Configuration

This document lists all environment variables required to run the AI Predictions platform on Railway or any other hosting platform.

## Required Environment Variables

### Database Configuration
```
DATABASE_URL=postgresql://user:password@host:5432/database
```
- **Description**: PostgreSQL or MySQL database connection string
- **Where to get it**: 
  - Railway: Create a PostgreSQL database service, copy the connection string
  - Supabase: Project Settings → Database → Connection String
  - PlanetScale: Dashboard → Connect → Connection String

### Clerk Authentication
```
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- **Description**: Clerk authentication keys for user login/signup
- **Where to get it**: 
  1. Sign up at https://clerk.com
  2. Create a new application
  3. Go to API Keys section
  4. Copy both Secret Key and Publishable Key
  5. Enable Google OAuth in "Configure" → "Social Connections"

### OpenAI API (Required for Railway/Production)
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- **Description**: OpenAI API key for AI predictions (GPT-4)
- **Required for**: Railway, Vercel, or any non-Manus deployment
- **Where to get it**:
  1. Sign up at https://platform.openai.com
  2. Go to API Keys section
  3. Create new secret key
  4. Add credits to your account ($5-10 to start)
- **Note**: The app automatically uses `BUILT_IN_FORGE_API_KEY` when running in Manus environment, and falls back to `OPENAI_API_KEY` for Railway/production deployments

### Alpha Vantage API (Optional - For Real-Time Stock Data)
```
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```
- **Description**: Alpha Vantage API key for real-time stock market data in Stocks & Markets predictions
- **Required for**: Stocks predictions with real-time market data
- **Where to get it**:
  1. Sign up at https://www.alphavantage.co/support/#api-key
  2. Get your free API key (25 requests/day)
  3. For higher limits, upgrade to premium ($49.99/month for 1200 requests/day)
- **Note**: If not provided, stock predictions will work but without real-time market data. The free tier (25 calls/day) is sufficient for moderate usage due to aggressive caching (4-hour TTL).

### Cloudflare R2 Storage
```
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_DOMAIN=your-custom-domain.com  # Optional
```
- **Description**: Cloudflare R2 storage for user-uploaded files
- **Where to get it**:
  1. Sign up at https://dash.cloudflare.com
  2. Go to R2 Object Storage
  3. Create a new bucket
  4. Go to "Manage R2 API Tokens"
  5. Create API token with read/write permissions
  6. Copy Account ID, Access Key ID, and Secret Access Key
  7. (Optional) Set up custom domain for public access

### Application Settings
```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
```
- **NODE_ENV**: Set to `production` for deployment
- **PORT**: Port number (Railway auto-assigns, usually 3000)
- **JWT_SECRET**: Random string for session security (generate with `openssl rand -base64 32`)

## Setting Environment Variables in Railway

1. Go to your Railway project
2. Click on your service
3. Go to "Variables" tab
4. Click "New Variable"
5. Add each variable name and value
6. Click "Deploy" to apply changes

## Setting Environment Variables in Vercel

1. Go to your Vercel project
2. Go to "Settings" → "Environment Variables"
3. Add each variable name and value
4. Select environment (Production, Preview, Development)
5. Click "Save"

## Local Development

For local development, create a `.env` file in the project root with all the variables above.

**Never commit `.env` file to git!**

## Cost Estimates

- **Railway Database**: $0-5/month (free tier available)
- **Clerk Auth**: $0 (free up to 10,000 users)
- **OpenAI API**: ~$0.01-0.03 per prediction (pay-as-you-go)
- **Cloudflare R2**: $0 (free up to 10GB storage)
- **Alpha Vantage API**: $0 (free tier: 25 calls/day) or $49.99/month (premium: 1200 calls/day)
- **The Sports DB API**: $0 (completely free, no rate limits)

**Total estimated cost**: $5-15/month to start (without premium Alpha Vantage)
