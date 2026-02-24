import { useQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';

/** Centralized query key factory for mood-related queries. */
export const moodQueryKeys = {
  moods: ['moods'] as const,
  moodById: (id: number) => ['moods', id] as const,
};

/**
 * Fetches all available moods for recipe generation.
 * Data is considered stale after 1 hour since moods rarely change.
 * @returns TanStack Query result containing an array of moods.
 */
export function useMoods() {
  return useQuery({
    queryKey: moodQueryKeys.moods,
    queryFn: async () => {
      const response = await mixrClient.getMoods();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - moods rarely change
  });
}

/**
 * Fetches a single mood by its ID.
 * @param id - The unique mood identifier.
 * @returns TanStack Query result containing the mood data.
 */
export function useMoodById(id: number) {
  return useQuery({
    queryKey: moodQueryKeys.moodById(id),
    queryFn: async () => {
      const response = await mixrClient.getMoodById(id);
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  });
}
