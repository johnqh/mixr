import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client with app-wide defaults.
 *
 * - Queries: 5-minute stale time, 10-minute garbage collection, up to 3 retries
 *   with exponential backoff (skips retries on 4xx client errors).
 * - Mutations: no automatic retries.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors
        const errorWithStatus = error as { status?: number };
        if (errorWithStatus?.status && errorWithStatus.status >= 400 && errorWithStatus.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});
