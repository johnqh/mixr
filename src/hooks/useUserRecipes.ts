import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import type { RecipeListParams } from '@sudobility/mixr_client';

export const userRecipesQueryKeys = {
  userRecipes: (params?: RecipeListParams) => ['user', 'recipes', params] as const,
  infiniteUserRecipes: (limit: number) => ['user', 'recipes', 'infinite', limit] as const,
};

export function useUserRecipes(params?: RecipeListParams) {
  return useQuery({
    queryKey: userRecipesQueryKeys.userRecipes(params),
    queryFn: async () => {
      const response = await mixrClient.getUserRecipes(params);
      return response.data || [];
    },
  });
}

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
