# Use Node.js 22 LTS
FROM node:22-slim AS base

# Install pnpm
RUN npm install -g pnpm@10

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
FROM base AS dependencies
RUN pnpm install --frozen-lockfile

# Build application
FROM dependencies AS build
COPY . .
RUN pnpm build

# Production image
FROM base AS production

# Copy dependencies and built files
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start command (migrations run at startup, not build time)
CMD ["pnpm", "start"]
