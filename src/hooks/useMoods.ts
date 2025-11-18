import { useQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';

export const moodQueryKeys = {
  moods: ['moods'] as const,
  moodById: (id: number) => ['moods', id] as const,
};

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
