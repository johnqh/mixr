import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import type { RatingListParams } from '@sudobility/mixr_client';

export const ratingQueryKeys = {
  ratings: (recipeId: number, params?: RatingListParams) => ['ratings', recipeId, params] as const,
  aggregate: (recipeId: number) => ['ratings', 'aggregate', recipeId] as const,
};

export function useRecipeRatings(recipeId: number, params?: RatingListParams) {
  return useQuery({
    queryKey: ratingQueryKeys.ratings(recipeId, params),
    queryFn: async () => {
      const response = await mixrClient.getRecipeRatings(recipeId, params);
      return response.data || [];
    },
  });
}

export function useRecipeRatingAggregate(recipeId: number) {
  return useQuery({
    queryKey: ratingQueryKeys.aggregate(recipeId),
    queryFn: async () => {
      const response = await mixrClient.getRecipeRatingAggregate(recipeId);
      return response.data;
    },
  });
}

export function useSubmitRating(recipeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rating: { stars: number; review?: string }) => {
      const response = await mixrClient.submitRecipeRating(recipeId, rating);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate ratings queries for this recipe
      queryClient.invalidateQueries({ queryKey: ['ratings', recipeId] });
    },
  });
}

export function useDeleteRating(recipeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ratingId: number) => {
      const response = await mixrClient.deleteRecipeRating(recipeId, ratingId);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate ratings queries for this recipe
      queryClient.invalidateQueries({ queryKey: ['ratings', recipeId] });
    },
  });
}
