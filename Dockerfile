# Use Node.js 22 LTS
FROM node:22-slim AS base

# Install pnpm
RUN npm install -g pnpm@10

# Set working directory
WORKDIR /app

# Copy package files and patches for dependency installation
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build application (creates dist/ and client/dist/)
RUN pnpm build

# Production image - start fresh to keep it lean
FROM node:22-slim AS production

# Install pnpm in production image
RUN npm install -g pnpm@10

WORKDIR /app

# Copy package files for production dependencies
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built files from base stage
COPY --from=base /app/dist ./dist
COPY --from=base /app/client/dist ./client/dist
COPY --from=base /app/drizzle ./drizzle
COPY --from=base /app/scripts ./scripts
COPY --from=base /app/drizzle.config.ts ./drizzle.config.ts

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start command (migrations run at startup, not build time)
CMD ["pnpm", "start"]
