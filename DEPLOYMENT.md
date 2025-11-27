# Deployment Guide: AI Predictions Platform

This guide will walk you through deploying the AI Predictions platform to Railway (recommended) or other hosting platforms.

## Prerequisites

Before deploying, you need to set up the following services:

1. **Database** (PostgreSQL or MySQL)
2. **Clerk Account** (for authentication)
3. **OpenAI API Key** (for AI predictions)
4. **Cloudflare R2** (for file storage)

---

## Option 1: Deploy to Railway (Recommended)

Railway provides the easiest deployment experience with built-in database support.

### Step 1: Set Up Services

#### 1.1 Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

#### 1.2 Create PostgreSQL Database
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Copy the `DATABASE_URL` from the "Connect" tab

### Step 2: Set Up External Services

#### 2.1 Clerk Authentication
1. Go to https://clerk.com and create an account
2. Create a new application
3. Go to "API Keys" and copy:
   - `CLERK_SECRET_KEY`
   - `CLERK_PUBLISHABLE_KEY` (this will be `VITE_CLERK_PUBLISHABLE_KEY`)
4. Go to "Configure" → "Social Connections"
5. Enable "Google" for Google OAuth login

#### 2.2 OpenAI API
1. Go to https://platform.openai.com
2. Create an account and add billing
3. Go to "API Keys" and create a new key
4. Copy the `OPENAI_API_KEY`
5. Add $5-10 credits to start

#### 2.3 Cloudflare R2 Storage
1. Go to https://dash.cloudflare.com
2. Navigate to "R2 Object Storage"
3. Create a new bucket (e.g., "ai-predictions-files")
4. Go to "Manage R2 API Tokens"
5. Create a new API token with read/write permissions
6. Copy the following:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME` (your bucket name)

### Step 3: Deploy to Railway

#### 3.1 Connect GitHub Repository
1. Push your code to GitHub
2. In Railway, click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

#### 3.2 Configure Environment Variables
1. Click on your service in Railway
2. Go to "Variables" tab
3. Add all environment variables:

```
DATABASE_URL=<from Railway PostgreSQL>
CLERK_SECRET_KEY=<from Clerk>
VITE_CLERK_PUBLISHABLE_KEY=<from Clerk>
OPENAI_API_KEY=<from OpenAI>
R2_ACCOUNT_ID=<from Cloudflare>
R2_ACCESS_KEY_ID=<from Cloudflare>
R2_SECRET_ACCESS_KEY=<from Cloudflare>
R2_BUCKET_NAME=<your bucket name>
NODE_ENV=production
JWT_SECRET=<generate with: openssl rand -base64 32>
```

#### 3.3 Deploy
1. Railway will automatically build and deploy
2. Wait for deployment to complete
3. Click "Generate Domain" to get your public URL

### Step 4: Configure Clerk Redirect URLs
1. Go back to Clerk dashboard
2. Go to "Paths" settings
3. Add your Railway domain to allowed redirect URLs:
   - `https://your-app.railway.app`

### Step 5: Test Your Deployment
1. Visit your Railway URL
2. Click "Get Your Prediction"
3. Sign up with Google
4. Test creating a prediction

---

## Option 2: Deploy to Vercel + Railway Database

Vercel is great for frontend hosting but requires external database.

### Step 1: Set Up Railway Database
Follow Step 1.2 from Option 1 to create a PostgreSQL database on Railway.

### Step 2: Deploy to Vercel
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Add all environment variables (same as Railway)
5. Deploy

**Note**: Vercel works best for serverless deployments. This full-stack app may require adjustments.

---

## Option 3: Deploy to Your Own VPS (DigitalOcean, AWS, etc.)

### Requirements
- Ubuntu 22.04 or similar
- Node.js 22.x
- pnpm
- PostgreSQL or MySQL database

### Deployment Steps

#### 1. Install Dependencies
```bash
# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Clone your repository
git clone https://github.com/your-username/ai-predictions.git
cd ai-predictions

# Install packages
pnpm install
```

#### 2. Set Up Environment Variables
```bash
# Create .env file
nano .env

# Add all environment variables (see ENV_VARIABLES.md)
```

#### 3. Build and Run
```bash
# Run database migrations
pnpm db:push

# Build the application
pnpm build

# Start the server
pnpm start
```

#### 4. Set Up Process Manager (PM2)
```bash
# Install PM2
npm install -g pm2

# Start app with PM2
pm2 start npm --name "ai-predictions" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

#### 5. Set Up Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt-get install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ai-predictions

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/ai-predictions /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Set Up SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Post-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] Database migrations have run successfully
- [ ] Clerk redirect URLs are configured
- [ ] Google OAuth is enabled in Clerk
- [ ] OpenAI API key has credits
- [ ] R2 bucket is created and accessible
- [ ] Application loads without errors
- [ ] User can sign up with Google
- [ ] User can create predictions
- [ ] File uploads work correctly
- [ ] Prediction history displays correctly

---

## Troubleshooting

### "CLERK_SECRET_KEY is not set"
- Make sure you've added `CLERK_SECRET_KEY` to environment variables
- Restart your service after adding variables

### "OPENAI_API_KEY environment variable is not set"
- Add `OPENAI_API_KEY` to environment variables
- Ensure you have credits in your OpenAI account

### "Cloudflare R2 credentials missing"
- Verify all R2 variables are set: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- Check that your R2 API token has read/write permissions

### Database connection errors
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from your hosting platform
- Run `pnpm db:push` to apply migrations

### Clerk redirect errors
- Add your deployment URL to Clerk's allowed redirect URLs
- Format: `https://your-domain.com`

---

## Monitoring and Maintenance

### Railway
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts for errors

### Cost Optimization
- Monitor OpenAI API usage
- Set spending limits in OpenAI dashboard
- Use Cloudflare R2 instead of AWS S3 (no egress fees)
- Consider caching frequently accessed predictions

---

## Updating Your Deployment

### Railway
```bash
git add .
git commit -m "Update feature"
git push origin main
```
Railway will automatically redeploy.

### Manual Deployment
```bash
git pull origin main
pnpm install
pnpm db:push
pnpm build
pm2 restart ai-predictions
```

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review environment variables in `ENV_VARIABLES.md`
3. Check Railway/Vercel logs for errors
4. Verify all external services (Clerk, OpenAI, R2) are configured correctly

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Rotate API keys** regularly
3. **Use strong JWT secrets** (generate with `openssl rand -base64 32`)
4. **Enable 2FA** on all service accounts (Clerk, OpenAI, Cloudflare)
5. **Monitor API usage** to detect unusual activity
6. **Set spending limits** on OpenAI API
7. **Backup your database** regularly

---

## Next Steps

After successful deployment:
1. Test all features thoroughly
2. Set up monitoring and alerts
3. Configure custom domain
4. Set up automated backups
5. Implement rate limiting for API endpoints
6. Add analytics tracking
7. Set up error tracking (e.g., Sentry)
