import { FC } from 'react';
import { Recipe } from '@sudobility/mixr_client';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard: FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow text-left"
    >
      {/* Placeholder image */}
      <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-6xl">
        🍸
      </div>

      <div className="p-4">
        {/* Name and Mood */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold flex-1">{recipe.name}</h3>
          {recipe.mood && <span className="text-2xl ml-2">{recipe.mood.emoji}</span>}
        </div>

        {/* Description */}
        {recipe.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Ingredients count */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{recipe.ingredients.length} ingredients</span>
          <span>{recipe.steps.length} steps</span>
        </div>

        {/* Mood name */}
        {recipe.mood && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded text-xs font-medium">
              {recipe.mood.name}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};
