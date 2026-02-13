import { FC } from 'react';
import { useEquipment } from '../../hooks/useEquipment';
import { useIngredients } from '../../hooks/useIngredients';
import { EquipmentSubcategory, IngredientSubcategory } from '@sudobility/mixr_client';
import { SelectableItemCard } from './SelectableItemCard';
import { SubcategoryKey } from './CategoryMasterPanel';

interface SubcategoryDetailPanelProps {
  activeCategory: SubcategoryKey;
  selectedEquipmentIds: number[];
  selectedIngredientIds: number[];
  noneCategories: Set<SubcategoryKey>;
  onToggleEquipment: (id: number, subcategoryKey: SubcategoryKey) => void;
  onToggleIngredient: (id: number, subcategoryKey: SubcategoryKey) => void;
  onToggleNone: (subcategoryKey: SubcategoryKey) => void;
  onNext: () => void;
  buttonLabel: string;
  isNextDisabled: boolean;
}

function formatSubcategoryLabel(subcategory: string): string {
  return subcategory
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export const SubcategoryDetailPanel: FC<SubcategoryDetailPanelProps> = ({
  activeCategory,
  selectedEquipmentIds,
  selectedIngredientIds,
  noneCategories,
  onToggleEquipment,
  onToggleIngredient,
  onToggleNone,
  onNext,
  buttonLabel,
  isNextDisabled,
}) => {
  const [type, subcategory] = activeCategory.split(':') as [string, string];
  const isEquipment = type === 'equipment';

  const { data: equipmentData, isLoading: equipmentLoading } = useEquipment(
    isEquipment ? (subcategory as EquipmentSubcategory) : undefined
  );
  const { data: ingredientData, isLoading: ingredientLoading } = useIngredients(
    !isEquipment ? (subcategory as IngredientSubcategory) : undefined
  );

  const items = isEquipment
    ? (equipmentData?.data || [])
    : (ingredientData?.data || []);
  const isLoading = isEquipment ? equipmentLoading : ingredientLoading;

  const selectedIds = isEquipment ? selectedEquipmentIds : selectedIngredientIds;
  const isNoneSelected = noneCategories.has(activeCategory);

  const currentCategorySelectedCount = items.filter(item =>
    selectedIds.includes(item.id)
  ).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4">
          {formatSubcategoryLabel(subcategory)}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* None card */}
          <SelectableItemCard
            id="none"
            name="None"
            icon="🚫"
            isSelected={isNoneSelected}
            onToggle={() => onToggleNone(activeCategory)}
          />

          {/* Item cards */}
          {items.map(item => (
            <SelectableItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              icon={item.icon || (isEquipment ? '🍸' : '🥃')}
              isSelected={selectedIds.includes(item.id)}
              onToggle={() =>
                isEquipment
                  ? onToggleEquipment(item.id, activeCategory)
                  : onToggleIngredient(item.id, activeCategory)
              }
            />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {isNoneSelected
            ? 'None selected'
            : `${currentCategorySelectedCount} selected`}
        </span>
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            isNextDisabled
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};
