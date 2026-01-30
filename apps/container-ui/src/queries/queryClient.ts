import { QueryClient } from "@tanstack/react-query";

/**
 * Query client configuration with default options
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes - data is considered fresh for this duration
      staleTime: 5 * 60 * 1000,
      // Cache time: 30 minutes - unused data stays in cache
      gcTime: 30 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

/**
 * Query keys for cache management
 */
export const queryKeys = {
  // Health check queries
  health: {
    all: ["health"] as const,
    fastApi: {
      all: () => [...queryKeys.health.all, "fastapi"] as const,
      health: () => [...queryKeys.health.fastApi.all(), "healthz"] as const,
      ready: () => [...queryKeys.health.fastApi.all(), "readyz"] as const,
      live: () => [...queryKeys.health.fastApi.all(), "livez"] as const,
    },
  },
} as const;

