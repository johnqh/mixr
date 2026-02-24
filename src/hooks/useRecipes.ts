import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';

/** Centralized query key factory for recipe-related queries. */
export const recipeQueryKeys = {
  recipes: (params?: { limit?: number; offset?: number }) => ['recipes', params] as const,
  recipeById: (id: number) => ['recipes', id] as const,
};

/**
 * Fetches a paginated list of recipes.
 * @param params - Optional pagination parameters (limit, offset).
 * @returns TanStack Query result containing the recipe list response.
 */
export function useRecipes(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: recipeQueryKeys.recipes(params),
    queryFn: () => mixrClient.getRecipes(params),
  });
}

/**
 * Fetches recipes with infinite scroll pagination.
 * Automatically requests the next page when `fetchNextPage` is called.
 * @param limit - Number of recipes per page (default: 20).
 * @returns TanStack infinite query result with flattened recipe pages.
 */
export function useInfiniteRecipes(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: ['recipes', 'infinite', limit],
    queryFn: ({ pageParam = 0 }) =>
      mixrClient.getRecipes({
        limit,
        offset: pageParam * limit,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentCount = allPages.length * limit;
      const totalCount = lastPage.count || 0;
      return currentCount < totalCount ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
}

/**
 * Fetches a single recipe by its ID.
 * @param id - The unique recipe identifier.
 * @returns TanStack Query result containing the recipe detail response.
 */
export function useRecipeById(id: number) {
  return useQuery({
    queryKey: recipeQueryKeys.recipeById(id),
    queryFn: () => mixrClient.getRecipeById(id),
  });
}
