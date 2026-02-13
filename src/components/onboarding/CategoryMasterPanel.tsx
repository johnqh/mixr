import { FC } from 'react';
import { MasterListItem } from '@sudobility/components';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export type SubcategoryKey = `equipment:${string}` | `ingredient:${string}`;

interface CategoryMasterPanelProps {
  activeCategory: SubcategoryKey;
  onCategorySelect: (category: SubcategoryKey) => void;
  reviewedCategories: Set<SubcategoryKey>;
  equipmentSubcategories: string[];
  ingredientSubcategories: string[];
  selectionCounts: Map<SubcategoryKey, number>;
}

function formatSubcategoryLabel(subcategory: string): string {
  return subcategory
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function getDescription(
  key: SubcategoryKey,
  selectionCounts: Map<SubcategoryKey, number>,
  reviewed: boolean
): string {
  if (!reviewed) return '';
  const count = selectionCounts.get(key) ?? 0;
  return count === 0 ? 'None' : `${count} selected`;
}

const CheckIcon: FC<{ className?: string }> = ({ className }) => (
  <CheckCircleIcon className={className} />
);

export const CategoryMasterPanel: FC<CategoryMasterPanelProps> = ({
  activeCategory,
  onCategorySelect,
  reviewedCategories,
  equipmentSubcategories,
  ingredientSubcategories,
  selectionCounts,
}) => {
  return (
    <div className="space-y-4">
      {/* Equipment Section */}
      <div>
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Equipment
        </div>
        <div className="space-y-1">
          {equipmentSubcategories.map(sub => {
            const key: SubcategoryKey = `equipment:${sub}`;
            const reviewed = reviewedCategories.has(key);
            return (
              <MasterListItem
                key={key}
                isSelected={activeCategory === key}
                onClick={() => onCategorySelect(key)}
                label={formatSubcategoryLabel(sub)}
                description={getDescription(key, selectionCounts, reviewed)}
                icon={reviewed ? CheckIcon : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Ingredients Section */}
      <div>
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Ingredients
        </div>
        <div className="space-y-1">
          {ingredientSubcategories.map(sub => {
            const key: SubcategoryKey = `ingredient:${sub}`;
            const reviewed = reviewedCategories.has(key);
            return (
              <MasterListItem
                key={key}
                isSelected={activeCategory === key}
                onClick={() => onCategorySelect(key)}
                label={formatSubcategoryLabel(sub)}
                description={getDescription(key, selectionCounts, reviewed)}
                icon={reviewed ? CheckIcon : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
