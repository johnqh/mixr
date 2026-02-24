import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import type { RecipeListParams } from '@sudobility/mixr_client';

/** Centralized query key factory for user recipe queries. */
export const userRecipesQueryKeys = {
  userRecipes: (params?: RecipeListParams) => ['user', 'recipes', params] as const,
  infiniteUserRecipes: (limit: number) => ['user', 'recipes', 'infinite', limit] as const,
};

/**
 * Fetches recipes created by the authenticated user.
 * @param params - Optional pagination and filter parameters.
 * @returns TanStack Query result containing an array of user recipes.
 */
export function useUserRecipes(params?: RecipeListParams) {
  return useQuery({
    queryKey: userRecipesQueryKeys.userRecipes(params),
    queryFn: async () => {
      const response = await mixrClient.getUserRecipes(params);
      return response.data || [];
    },
  });
}

/**
 * Fetches user recipes with infinite scroll pagination.
 * @param limit - Number of recipes per page (default: 20).
 * @returns TanStack infinite query result with paginated user recipes.
 */
export function useInfiniteUserRecipes(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: userRecipesQueryKeys.infiniteUserRecipes(limit),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await mixrClient.getUserRecipes({
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
