import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';

export const recipeQueryKeys = {
  recipes: (params?: { limit?: number; offset?: number }) => ['recipes', params] as const,
  recipeById: (id: number) => ['recipes', id] as const,
};

export function useRecipes(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: recipeQueryKeys.recipes(params),
    queryFn: () => mixrClient.getRecipes(params),
  });
}

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

export function useRecipeById(id: number) {
  return useQuery({
    queryKey: recipeQueryKeys.recipeById(id),
    queryFn: () => mixrClient.getRecipeById(id),
  });
}
