import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import type { RecipeListParams } from '@sudobility/mixr_client';

/** Centralized query key factory for favorite-related queries. */
export const favoritesQueryKeys = {
  favorites: (params?: RecipeListParams) => ['favorites', params] as const,
  infiniteFavorites: (limit: number) => ['favorites', 'infinite', limit] as const,
};

/**
 * Fetches the authenticated user's favorite recipes.
 * @param params - Optional pagination and filter parameters.
 * @returns TanStack Query result containing an array of favorite recipes.
 */
export function useUserFavorites(params?: RecipeListParams) {
  return useQuery({
    queryKey: favoritesQueryKeys.favorites(params),
    queryFn: async () => {
      const response = await mixrClient.getUserFavorites(params);
      return response.data || [];
    },
  });
}

/**
 * Fetches favorite recipes with infinite scroll pagination.
 * @param limit - Number of favorites per page (default: 20).
 * @returns TanStack infinite query result with paginated favorites.
 */
export function useInfiniteFavorites(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: favoritesQueryKeys.infiniteFavorites(limit),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await mixrClient.getUserFavorites({
        limit,
        offset: pageParam * limit,
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentCount = allPages.length * limit;
      const totalCount = lastPage.count || 0;
      return currentCount < totalCount ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
}

/**
 * Mutation hook to add a recipe to the user's favorites.
 * Invalidates all favorites queries on success.
 * @returns TanStack mutation accepting a recipe ID.
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipeId: number) => {
      const response = await mixrClient.addFavorite({ recipe_id: recipeId });
      return response;
    },
    onSuccess: () => {
      // Invalidate favorites queries
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

/**
 * Mutation hook to remove a recipe from the user's favorites.
 * Invalidates all favorites queries on success.
 * @returns TanStack mutation accepting a recipe ID.
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipeId: number) => {
      const response = await mixrClient.removeFavorite(recipeId);
      return response;
    },
    onSuccess: () => {
      // Invalidate favorites queries
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
