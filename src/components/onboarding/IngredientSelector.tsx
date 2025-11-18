import { FC, useState } from 'react';
import { useIngredients, useIngredientSubcategories } from '../../hooks/useIngredients';
import { Ingredient, IngredientSubcategory } from '@sudobility/mixr_client';

interface IngredientSelectorProps {
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export const IngredientSelector: FC<IngredientSelectorProps> = ({
  selectedIds,
  onSelectionChange,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    IngredientSubcategory | undefined
  >('spirit');
  const { data: ingredientsData, isLoading } = useIngredients(selectedSubcategory);
  const { data: subcategoriesData } = useIngredientSubcategories();

  const ingredients = ingredientsData?.data || [];
  const subcategories = subcategoriesData?.data || [];

  const toggleIngredient = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subcategory Tabs */}
      {subcategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {subcategories.map(subcategory => (
              <button
                key={subcategory}
                onClick={() => setSelectedSubcategory(subcategory as IngredientSubcategory)}
                className={`px-4 py-2 rounded-full font-medium transition-colors capitalize ${
                  selectedSubcategory === subcategory
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {subcategory.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Select Ingredients ({selectedIds.length} selected)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ingredients.map((item: Ingredient) => (
            <button
              key={item.id}
              onClick={() => toggleIngredient(item.id)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedIds.includes(item.id)
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className="text-3xl mb-2">{item.icon || '🥃'}</div>
              <div className="text-sm font-medium">{item.name}</div>
              {selectedIds.includes(item.id) && (
                <div className="mt-2 text-purple-600 dark:text-purple-400">✓</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
