import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import { recipeQueryKeys } from './useRecipes';
import type { GenerateRecipeRequest } from '@sudobility/mixr_client';

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
