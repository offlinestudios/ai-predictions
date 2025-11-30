export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Owner ID for admin access
export const OWNER_OPEN_ID = import.meta.env.VITE_OWNER_OPEN_ID || "";

// Generate Clerk sign-in URL
export const getLoginUrl = () => {
  // Clerk handles sign-in through its components
  // This URL is used for programmatic redirects
  return "/sign-in";
};
