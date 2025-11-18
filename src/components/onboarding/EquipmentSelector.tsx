import { FC, useState } from 'react';
import { useEquipment, useEquipmentSubcategories } from '../../hooks/useEquipment';
import { Equipment, EquipmentSubcategory } from '@sudobility/mixr_client';

interface EquipmentSelectorProps {
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

const PRESET_KITS = {
  beginner: {
    name: 'Beginner Kit',
    description: 'Essential tools to get started',
    equipment: ['Cocktail Shaker', 'Jigger', 'Bar Spoon', 'Strainer'],
  },
  homeBar: {
    name: 'Home Bar',
    description: 'Everything for a well-stocked home bar',
    equipment: [
      'Cocktail Shaker',
      'Jigger',
      'Bar Spoon',
      'Strainer',
      'Muddler',
      'Mixing Glass',
      'Citrus Juicer',
    ],
  },
  pro: {
    name: 'Professional',
    description: 'Complete professional bar setup',
    equipment: [
      'Cocktail Shaker',
      'Jigger',
      'Bar Spoon',
      'Strainer',
      'Muddler',
      'Mixing Glass',
      'Citrus Juicer',
      'Channel Knife',
      'Fine Strainer',
      'Ice Crusher',
    ],
  },
};

export const EquipmentSelector: FC<EquipmentSelectorProps> = ({
  selectedIds,
  onSelectionChange,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<EquipmentSubcategory | undefined>(
    undefined
  );
  const { data: equipmentData, isLoading } = useEquipment(selectedSubcategory);
  const { data: subcategoriesData } = useEquipmentSubcategories();

  const equipment = equipmentData?.data || [];
  const subcategories = subcategoriesData?.data || [];

  const toggleEquipment = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const selectPreset = (presetKey: keyof typeof PRESET_KITS) => {
    const preset = PRESET_KITS[presetKey];
    const presetIds = equipment
      .filter(item => preset.equipment.includes(item.name))
      .map(item => item.id);
    onSelectionChange(presetIds);
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
      {/* Preset Kits */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Start Presets</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(PRESET_KITS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => selectPreset(key as keyof typeof PRESET_KITS)}
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-left"
            >
              <h4 className="font-semibold mb-1">{preset.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Filter */}
      {subcategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubcategory(undefined)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedSubcategory === undefined
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {subcategories.map(subcategory => (
              <button
                key={subcategory}
                onClick={() => setSelectedSubcategory(subcategory as EquipmentSubcategory)}
                className={`px-4 py-2 rounded-full font-medium transition-colors capitalize ${
                  selectedSubcategory === subcategory
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {subcategory}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Select Equipment ({selectedIds.length} selected)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {equipment.map((item: Equipment) => (
            <button
              key={item.id}
              onClick={() => toggleEquipment(item.id)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedIds.includes(item.id)
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className="text-3xl mb-2">{item.icon || '🍸'}</div>
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
