import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import type { UpdateUserRequest } from '@sudobility/mixr_client';

export const userQueryKeys = {
  currentUser: ['user', 'me'] as const,
  preferences: ['user', 'preferences'] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: userQueryKeys.currentUser,
    queryFn: async () => {
      const response = await mixrClient.getCurrentUser();
      return response.data;
    },
    retry: false, // Don't retry if user doesn't exist yet
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateUserRequest) => {
      const response = await mixrClient.updateCurrentUser(request);
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKeys.currentUser, user);
    },
  });
}

export function useUserPreferences() {
  return useQuery({
    queryKey: userQueryKeys.preferences,
    queryFn: async () => {
      const response = await mixrClient.getUserPreferences();
      return response.data;
    },
    retry: false,
  });
}

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: { equipment_ids: number[]; ingredient_ids: number[] }) => {
      const response = await mixrClient.updateUserPreferences(preferences);
      return response.data;
    },
    onSuccess: (preferences) => {
      queryClient.setQueryData(userQueryKeys.preferences, preferences);
    },
  });
}
