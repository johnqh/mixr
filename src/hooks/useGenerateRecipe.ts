import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import { recipeQueryKeys } from './useRecipes';
import type { GenerateRecipeRequest } from '@sudobility/mixr_client';

/**
 * Mutation hook for AI-powered recipe generation.
 * Sends mood, equipment, and ingredient selections to the API and returns
 * a generated recipe. On success, invalidates recipe list queries and
 * seeds the recipe detail cache.
 *
 * @returns TanStack mutation with `mutate(request)` accepting a {@link GenerateRecipeRequest}.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useGenerateRecipe();
 * mutate({ mood_id: 1, equipment_ids: [2], ingredient_ids: [3] });
 * ```
 */
export function useGenerateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GenerateRecipeRequest) => {
      const response = await mixrClient.generateRecipe(request);
      const recipe = response.data;

      if (!recipe) {
        throw new Error('Failed to generate recipe');
      }

      return recipe;
    },
    onSuccess: (recipe) => {
      // Invalidate recipe lists to include the new recipe
      queryClient.invalidateQueries({ queryKey: ['recipes'] });

      // Add the recipe to the cache
      queryClient.setQueryData(recipeQueryKeys.recipeById(recipe.id), {
        success: true,
        data: recipe,
        count: 1,
      });
    },
  });
}
