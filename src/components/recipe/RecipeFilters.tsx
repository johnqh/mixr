import { FC } from 'react';

/** Props for the {@link RecipeFilters} component. */
interface RecipeFiltersProps {
  /** Current search query string. */
  searchQuery: string;
  /** Callback fired when the search query changes. */
  onSearchChange: (query: string) => void;
}

/**
 * Search filter bar for recipe browsing.
 * Provides a text input to filter recipes by name, description, or mood.
 */
export const RecipeFilters: FC<RecipeFiltersProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="mb-6">
      <div className="flex gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="recipe-search" className="sr-only">Search recipes</label>
          <input
            id="recipe-search"
            type="search"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
};
