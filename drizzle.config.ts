import { defineConfig } from "drizzle-kit";

// During build, DATABASE_URL might not be available
// Use a placeholder that will be replaced at runtime
const connectionString = process.env.DATABASE_URL || "postgresql://placeholder";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
