import { useQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import { IngredientSubcategory } from '@sudobility/mixr_client';

export const queryKeys = {
  ingredients: ['ingredients'] as const,
  ingredientsBySubcategory: (subcategory?: IngredientSubcategory) =>
    ['ingredients', subcategory] as const,
  ingredientSubcategories: ['ingredients', 'subcategories'] as const,
};

export function useIngredients(subcategory?: IngredientSubcategory) {
  return useQuery({
    queryKey: queryKeys.ingredientsBySubcategory(subcategory),
    queryFn: () => mixrClient.getIngredients(subcategory),
  });
}

export function useIngredientSubcategories() {
  return useQuery({
    queryKey: queryKeys.ingredientSubcategories,
    queryFn: () => mixrClient.getIngredientSubcategories(),
  });
}
