import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import type { RatingListParams } from '@sudobility/mixr_client';

/** Centralized query key factory for rating-related queries. */
export const ratingQueryKeys = {
  ratings: (recipeId: number, params?: RatingListParams) => ['ratings', recipeId, params] as const,
  aggregate: (recipeId: number) => ['ratings', 'aggregate', recipeId] as const,
};

/**
 * Fetches the list of individual ratings/reviews for a recipe.
 * @param recipeId - The recipe to fetch ratings for.
 * @param params - Optional sorting and pagination parameters.
 * @returns TanStack Query result containing an array of ratings.
 */
export function useRecipeRatings(recipeId: number, params?: RatingListParams) {
  return useQuery({
    queryKey: ratingQueryKeys.ratings(recipeId, params),
    queryFn: async () => {
      const response = await mixrClient.getRecipeRatings(recipeId, params);
      return response.data || [];
    },
  });
}

/**
 * Fetches aggregate rating statistics (average, total, distribution) for a recipe.
 * @param recipeId - The recipe to fetch aggregate ratings for.
 * @returns TanStack Query result containing the aggregate rating data.
 */
export function useRecipeRatingAggregate(recipeId: number) {
  return useQuery({
    queryKey: ratingQueryKeys.aggregate(recipeId),
    queryFn: async () => {
      const response = await mixrClient.getRecipeRatingAggregate(recipeId);
      return response.data;
    },
  });
}

/**
 * Mutation hook to submit a star rating and optional text review for a recipe.
 * Invalidates the recipe's rating queries on success.
 * @param recipeId - The recipe to rate.
 * @returns TanStack mutation accepting `{ stars: number; review?: string }`.
 */
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

/**
 * Mutation hook to delete a rating by its ID.
 * Invalidates the recipe's rating queries on success.
 * @param recipeId - The recipe whose rating should be deleted.
 * @returns TanStack mutation accepting a rating ID.
 */
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
