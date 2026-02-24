import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import type { UpdateUserRequest } from '@sudobility/mixr_client';

/** Centralized query key factory for user-related queries. */
export const userQueryKeys = {
  currentUser: ['user', 'me'] as const,
  preferences: ['user', 'preferences'] as const,
};

/**
 * Fetches the currently authenticated user's profile.
 * Retries are disabled since a missing user is expected for new accounts.
 * @returns TanStack Query result containing the user data.
 */
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

/**
 * Mutation hook to update the current user's profile.
 * Optimistically updates the user cache on success.
 * @returns TanStack mutation accepting an {@link UpdateUserRequest}.
 */
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

/**
 * Fetches the current user's equipment and ingredient preferences.
 * Retries are disabled since preferences may not exist for new users.
 * @returns TanStack Query result containing the preferences data.
 */
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

/**
 * Mutation hook to update the user's equipment and ingredient preferences.
 * Updates the preferences cache on success.
 * @returns TanStack mutation accepting `{ equipment_ids: number[]; ingredient_ids: number[] }`.
 */
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
