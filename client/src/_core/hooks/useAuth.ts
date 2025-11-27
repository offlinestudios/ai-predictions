import { useUser, useClerk } from "@clerk/clerk-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerk();
  const utils = trpc.useUtils();

  // Still fetch user from our database via tRPC
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!clerkUser, // Only fetch if Clerk user exists
  });

  const logout = useCallback(async () => {
    try {
      // Sign out from Clerk
      await signOut();
      // Clear our local cache
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, [signOut, utils]);

  const state = useMemo(() => {
    // Store user info in localStorage for compatibility
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    
    return {
      user: meQuery.data ?? null,
      loading: !clerkLoaded || meQuery.isLoading,
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(clerkUser && meQuery.data),
    };
  }, [
    clerkUser,
    clerkLoaded,
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (!clerkLoaded || meQuery.isLoading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    clerkLoaded,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
