# AI Predictions Platform

A mystical AI-powered prediction platform that provides personalized insights about career, love life, finances, and health. Built with React, Express, tRPC, and powered by OpenAI's GPT-4.

![AI Predictions](client/public/globe-logo.png)

## ✨ Features

- 🔮 **AI-Powered Predictions**: Get personalized predictions using advanced AI
- 📁 **File Upload Support**: Upload images, PDFs, and documents for context
- 📜 **Prediction History**: View all your past predictions
- 🎨 **Beautiful UI**: Modern, mystical design with dark theme
- 🔐 **Secure Authentication**: Google OAuth via Clerk
- 💳 **Subscription Tiers**: Free, Pro, and Premium plans
- 📱 **Responsive Design**: Works on desktop and mobile

## 🚀 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **shadcn/ui** components
- **tRPC** for type-safe API calls
- **Clerk** for authentication

### Backend
- **Express 4** server
- **tRPC 11** for API layer
- **Drizzle ORM** for database
- **OpenAI GPT-4** for AI predictions
- **Cloudflare R2** for file storage

### Database
- **PostgreSQL** or **MySQL**

## 📋 Prerequisites

Before deploying, you need accounts for:

1. **Clerk** (https://clerk.com) - Free tier available
2. **OpenAI** (https://platform.openai.com) - Pay-as-you-go
3. **Cloudflare** (https://dash.cloudflare.com) - Free tier available
4. **Railway** or **Vercel** - For hosting

## 🛠️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/offlinestudios/PPT.git
cd PPT
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_predictions

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxxxx
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# Cloudflare R2
R2_ACCOUNT_ID=xxxxx
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET_NAME=ai-predictions

# App Settings
NODE_ENV=development
JWT_SECRET=your-secret-key
```

See [ENV_VARIABLES.md](ENV_VARIABLES.md) for detailed instructions on obtaining these values.

### 4. Set up the database
```bash
pnpm db:push
```

### 5. Run the development server
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## 🚢 Deployment

### Deploy to Railway (Recommended)

Railway provides the easiest deployment with built-in PostgreSQL database.

1. **Create Railway Account**: https://railway.app
2. **Create PostgreSQL Database**: Provision a PostgreSQL service
3. **Deploy from GitHub**: Connect your repository
4. **Add Environment Variables**: See [DEPLOYMENT.md](DEPLOYMENT.md)
5. **Deploy**: Railway will automatically build and deploy

**Detailed deployment guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

### Deploy to Other Platforms

- **Vercel**: See [DEPLOYMENT.md](DEPLOYMENT.md#option-2-deploy-to-vercel--railway-database)
- **VPS/Self-hosted**: See [DEPLOYMENT.md](DEPLOYMENT.md#option-3-deploy-to-your-own-vps-digitalocean-aws-etc)

## 📁 Project Structure

```
ai-predictions/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and tRPC client
│   │   └── _core/         # Core hooks (useAuth)
│   └── public/            # Static assets
├── server/                # Backend Express server
│   ├── _core/             # Core server utilities
│   │   ├── clerkAuth.ts  # Clerk authentication
│   │   ├── llm.ts        # OpenAI integration
│   │   └── context.ts    # tRPC context
│   ├── routers.ts         # tRPC API routes
│   ├── db.ts              # Database queries
│   └── storage.ts         # Cloudflare R2 storage
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Database tables
├── shared/                # Shared types and constants
├── railway.json           # Railway deployment config
├── nixpacks.toml          # Build configuration
└── DEPLOYMENT.md          # Deployment guide
```

## 🔑 Environment Variables

All required environment variables are documented in [ENV_VARIABLES.md](ENV_VARIABLES.md).

Key variables:
- `DATABASE_URL` - PostgreSQL/MySQL connection string
- `CLERK_SECRET_KEY` - Clerk authentication
- `OPENAI_API_KEY` - OpenAI API access
- `R2_*` - Cloudflare R2 storage credentials

## 🧪 Testing

Run tests:
```bash
pnpm test
```

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm db:push` - Push database schema changes
- `pnpm check` - Type check
- `pnpm format` - Format code with Prettier

## 🎨 Features in Detail

### Authentication
- Google OAuth via Clerk
- Secure session management
- User profile management

### AI Predictions
- Powered by OpenAI GPT-4
- Supports text questions
- Accepts file uploads (images, PDFs, documents)
- Contextual analysis

### Subscription Tiers
- **Free**: 3 predictions total, no history
- **Pro**: 50 predictions/day, full history
- **Premium**: Unlimited predictions, priority support

### File Storage
- Cloudflare R2 (S3-compatible)
- Supports images, PDFs, documents
- 10MB file size limit

## 💰 Cost Estimates

- **Railway Database**: $0-5/month (free tier available)
- **Clerk Auth**: $0 (free up to 10,000 users)
- **OpenAI API**: ~$0.01-0.03 per prediction
- **Cloudflare R2**: $0 (free up to 10GB)

**Total**: $5-15/month to start

## 🔒 Security

- JWT-based session management
- Secure password hashing
- Environment variable protection
- CORS configuration
- Rate limiting (recommended for production)

## 🐛 Troubleshooting

Common issues and solutions are documented in [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting).

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Support

For deployment help, see [DEPLOYMENT.md](DEPLOYMENT.md).

For environment variable setup, see [ENV_VARIABLES.md](ENV_VARIABLES.md).

---

Built with ❤️ using React, Express, tRPC, and OpenAI
