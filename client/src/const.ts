export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate Clerk sign-in URL
export const getLoginUrl = () => {
  // Clerk handles sign-in through its components
  // This URL is used for programmatic redirects
  return "/sign-in";
};
