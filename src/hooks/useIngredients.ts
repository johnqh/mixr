import { useQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import { IngredientSubcategory } from '@sudobility/mixr_client';

/** Centralized query key factory for ingredient-related queries. */
export const queryKeys = {
  ingredients: ['ingredients'] as const,
  ingredientsBySubcategory: (subcategory?: IngredientSubcategory) =>
    ['ingredients', subcategory] as const,
  ingredientSubcategories: ['ingredients', 'subcategories'] as const,
};

/**
 * Fetches ingredients, optionally filtered by subcategory.
 * @param subcategory - Optional subcategory to filter ingredients by.
 * @returns TanStack Query result containing the ingredient list.
 */
export function useIngredients(subcategory?: IngredientSubcategory) {
  return useQuery({
    queryKey: queryKeys.ingredientsBySubcategory(subcategory),
    queryFn: () => mixrClient.getIngredients(subcategory),
  });
}

/**
 * Fetches the list of ingredient subcategories.
 * @returns TanStack Query result containing the subcategory list.
 */
export function useIngredientSubcategories() {
  return useQuery({
    queryKey: queryKeys.ingredientSubcategories,
    queryFn: () => mixrClient.getIngredientSubcategories(),
  });
}
