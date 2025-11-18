import { FC } from 'react';

interface RecipeFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const RecipeFilters: FC<RecipeFiltersProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="mb-6">
      <div className="flex gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
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
