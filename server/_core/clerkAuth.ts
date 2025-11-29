import { createClerkClient, verifyToken } from "@clerk/backend";
import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";

// Initialize Clerk client
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

/**
 * Authenticate a request using Clerk session token
 * Returns the user from our database or null if not authenticated
 */
export async function authenticateRequest(req: Request): Promise<User | null> {
  try {
    // Get session token from Authorization header or __session cookie
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.replace("Bearer ", "") || req.cookies?.__session;

    if (!sessionToken) {
      return null;
    }

    // Use modern verifyToken for networkless verification
    const verifiedToken = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    if (!verifiedToken || !verifiedToken.sub) {
      return null;
    }

    const userId = verifiedToken.sub;

    // Get Clerk user details
    const clerkUser = await clerk.users.getUser(userId);

    if (!clerkUser) {
      return null;
    }

    // Upsert user in our database
    await db.upsertUser({
      openId: clerkUser.id, // Use Clerk user ID as openId
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
      email: clerkUser.emailAddresses[0]?.emailAddress || null,
      loginMethod: "clerk",
      lastSignedIn: new Date(),
    });

    // Fetch and return the user from database
    const user = await db.getUserByOpenId(clerkUser.id);
    return user || null;
  } catch (error) {
    console.error("[Clerk Auth] Authentication failed:", error);
    return null;
  }
}

/**
 * Get the Clerk sign-in URL for redirecting users
 */
export function getSignInUrl(): string {
  const frontendApi = process.env.VITE_CLERK_PUBLISHABLE_KEY?.split("_")[1] || "";
  return `https://accounts.${frontendApi}.clerk.accounts.dev/sign-in`;
}
