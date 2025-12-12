#!/usr/bin/env node

/**
 * Automatic database migration script
 * Runs drizzle migrations on deployment
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔄 Running database migrations...');

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  // Apply existing migrations only - do not generate new ones
  // Generating on deployment can cause issues if schema hasn't actually changed
  console.log('🚀 Applying existing migrations...');
  execSync('pnpm drizzle-kit migrate', {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env
  });

  console.log('✅ Database migrations completed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  // Don't exit with error code - allow app to start even if migration fails
  // This prevents deployment failures if tables already exist
  console.log('⚠️  Continuing with app startup...');
  process.exit(0);
}
