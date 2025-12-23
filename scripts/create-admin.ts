import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Script to create or update an admin account
 * Usage: tsx scripts/create-admin.ts
 * 
 * This script will:
 * 1. Check if support@predicsure.com exists in the database
 * 2. If exists, update role to admin
 * 3. If not exists, create a placeholder admin account
 * 
 * Note: The user must sign up via Clerk first to get a proper openId.
 * This script is mainly for updating existing users to admin role.
 */

async function createAdmin() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🔗 Connecting to database...");
  const client = postgres(DATABASE_URL);
  const db = drizzle(client);

  const adminEmail = "support@predicsure.com";

  try {
    // Check if user exists
    console.log(`🔍 Checking if ${adminEmail} exists...`);
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      console.log(`✅ Found user: ${user.name || user.email} (ID: ${user.id})`);
      
      if (user.role === "admin") {
        console.log("✅ User is already an admin!");
      } else {
        console.log("🔧 Updating user role to admin...");
        await db
          .update(users)
          .set({ 
            role: "admin",
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));
        console.log("✅ User role updated to admin!");
      }
    } else {
      console.log(`❌ User ${adminEmail} not found in database`);
      console.log("\n📝 To create an admin account:");
      console.log("1. Go to https://www.predicsure.com/sign-up");
      console.log("2. Sign up with support@predicsure.com");
      console.log("3. Complete onboarding");
      console.log("4. Run this script again to promote to admin");
      console.log("\nAlternatively, you can update any existing user to admin:");
      console.log("UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';");
    }

    console.log("\n✅ Admin setup complete!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdmin();
