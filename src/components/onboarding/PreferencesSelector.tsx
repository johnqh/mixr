import { FC, useState, useMemo, useCallback, useEffect } from 'react';
import { MasterDetailLayout } from '@sudobility/components';
import { useEquipment, useEquipmentSubcategories } from '../../hooks/useEquipment';
import { useIngredients, useIngredientSubcategories } from '../../hooks/useIngredients';
import { CategoryMasterPanel, SubcategoryKey } from './CategoryMasterPanel';
import { SubcategoryDetailPanel } from './SubcategoryDetailPanel';
import { OnboardingProgress } from './OnboardingProgress';

interface PreferencesSelectorProps {
  initialEquipmentIds: number[];
  initialIngredientIds: number[];
  onEquipmentChange: (ids: number[]) => void;
  onIngredientChange: (ids: number[]) => void;
  onComplete: () => void;
}

const PRESET_KITS = {
  beginner: {
    name: 'Beginner Kit',
    icon: '🌱',
    description: 'Essential tools to get started',
    equipment: ['Cocktail Shaker', 'Jigger', 'Bar Spoon', 'Strainer'],
  },
  homeBar: {
    name: 'Home Bar',
    icon: '🏠',
    description: 'Everything for a well-stocked home bar',
    equipment: [
      'Cocktail Shaker', 'Jigger', 'Bar Spoon', 'Strainer', 'Muddler',
      'Mixing Glass', 'Citrus Juicer',
    ],
  },
  pro: {
    name: 'Professional',
    icon: '⭐',
    description: 'Complete professional bar setup',
    equipment: [
      'Cocktail Shaker', 'Jigger', 'Bar Spoon', 'Strainer', 'Muddler',
      'Mixing Glass', 'Citrus Juicer', 'Channel Knife', 'Fine Strainer',
      'Ice Crusher',
    ],
  },
};

const EQUIPMENT_ORDER = ['essential', 'glassware', 'garnish', 'advanced'];
const INGREDIENT_ORDER = ['spirit', 'wine', 'other_alcohol', 'fruit', 'spice', 'other'];

export const PreferencesSelector: FC<PreferencesSelectorProps> = ({
  initialEquipmentIds,
  initialIngredientIds,
  onEquipmentChange,
  onIngredientChange,
  onComplete,
}) => {
  const [showPresetStep, setShowPresetStep] = useState(true);
  const [activeCategory, setActiveCategory] = useState<SubcategoryKey>('equipment:essential');
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<number[]>(initialEquipmentIds);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>(initialIngredientIds);
  const [noneCategories, setNoneCategories] = useState<Set<SubcategoryKey>>(new Set());
  const [selectionsByCategory, setSelectionsByCategory] = useState<Map<SubcategoryKey, Set<number>>>(new Map());
  const [mobileView, setMobileView] = useState<'navigation' | 'content'>('navigation');

  // Fetch subcategories
  const { data: equipSubData } = useEquipmentSubcategories();
  const { data: ingredSubData } = useIngredientSubcategories();

  // Fetch all equipment (no subcategory filter) for preset matching and returning user init
  const { data: allEquipmentData } = useEquipment();
  const { data: allIngredientData } = useIngredients();

  const equipmentSubcategories = useMemo(() => {
    const subs = equipSubData?.data || [];
    return EQUIPMENT_ORDER.filter(s => subs.includes(s));
  }, [equipSubData]);

  const ingredientSubcategories = useMemo(() => {
    const subs = ingredSubData?.data || [];
    return INGREDIENT_ORDER.filter(s => subs.includes(s));
  }, [ingredSubData]);

  const categoryOrder = useMemo<SubcategoryKey[]>(() => [
    ...equipmentSubcategories.map(s => `equipment:${s}` as SubcategoryKey),
    ...ingredientSubcategories.map(s => `ingredient:${s}` as SubcategoryKey),
  ], [equipmentSubcategories, ingredientSubcategories]);

  // Initialize returning users: map their existing IDs to subcategories
  useEffect(() => {
    if (
      (initialEquipmentIds.length === 0 && initialIngredientIds.length === 0) ||
      categoryOrder.length === 0
    ) return;

    const allEquipment = allEquipmentData?.data || [];
    const allIngredients = allIngredientData?.data || [];
    if (allEquipment.length === 0 && allIngredients.length === 0) return;

    const newSelectionsByCategory = new Map<SubcategoryKey, Set<number>>();

    for (const item of allEquipment) {
      if (initialEquipmentIds.includes(item.id)) {
        const key: SubcategoryKey = `equipment:${item.subcategory}`;
        if (!newSelectionsByCategory.has(key)) {
          newSelectionsByCategory.set(key, new Set());
        }
        newSelectionsByCategory.get(key)!.add(item.id);
      }
    }

    for (const item of allIngredients) {
      if (initialIngredientIds.includes(item.id)) {
        const key: SubcategoryKey = `ingredient:${item.subcategory}`;
        if (!newSelectionsByCategory.has(key)) {
          newSelectionsByCategory.set(key, new Set());
        }
        newSelectionsByCategory.get(key)!.add(item.id);
      }
    }

    if (newSelectionsByCategory.size > 0) {
      setSelectionsByCategory(newSelectionsByCategory);
      setSelectedEquipmentIds(initialEquipmentIds);
      setSelectedIngredientIds(initialIngredientIds);
      setShowPresetStep(false);
    }
  }, [initialEquipmentIds, initialIngredientIds, allEquipmentData, allIngredientData, categoryOrder]);

  // Derived state
  const reviewedCategories = useMemo(() => {
    const reviewed = new Set<SubcategoryKey>();
    for (const key of categoryOrder) {
      const hasSelections = selectionsByCategory.has(key) && selectionsByCategory.get(key)!.size > 0;
      if (hasSelections || noneCategories.has(key)) {
        reviewed.add(key);
      }
    }
    return reviewed;
  }, [categoryOrder, selectionsByCategory, noneCategories]);

  const allCategoriesReviewed = categoryOrder.length > 0 && reviewedCategories.size === categoryOrder.length;

  const selectionCounts = useMemo(() => {
    const counts = new Map<SubcategoryKey, number>();
    for (const [key, ids] of selectionsByCategory) {
      counts.set(key, ids.size);
    }
    for (const key of noneCategories) {
      if (!counts.has(key)) {
        counts.set(key, 0);
      }
    }
    return counts;
  }, [selectionsByCategory, noneCategories]);

  const currentIndex = categoryOrder.indexOf(activeCategory);
  const hasUnreviewedAhead = categoryOrder.slice(currentIndex + 1).some(k => !reviewedCategories.has(k));
  const buttonLabel = allCategoriesReviewed && !hasUnreviewedAhead ? 'Finish' : 'Next';

  // Current subcategory has selection or none
  const currentHasSelection = reviewedCategories.has(activeCategory);
  const isNextDisabled = !currentHasSelection;

  // Handlers
  const handleToggleEquipment = useCallback((id: number, subcategoryKey: SubcategoryKey) => {
    setSelectedEquipmentIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      onEquipmentChange(next);
      return next;
    });
    setSelectionsByCategory(prev => {
      const next = new Map(prev);
      const current = new Set(next.get(subcategoryKey) || []);
      if (current.has(id)) {
        current.delete(id);
      } else {
        current.add(id);
      }
      if (current.size === 0) {
        next.delete(subcategoryKey);
      } else {
        next.set(subcategoryKey, current);
      }
      return next;
    });
    // Deselect "None" when selecting a real item
    setNoneCategories(prev => {
      if (!prev.has(subcategoryKey)) return prev;
      const next = new Set(prev);
      next.delete(subcategoryKey);
      return next;
    });
  }, [onEquipmentChange]);

  const handleToggleIngredient = useCallback((id: number, subcategoryKey: SubcategoryKey) => {
    setSelectedIngredientIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      onIngredientChange(next);
      return next;
    });
    setSelectionsByCategory(prev => {
      const next = new Map(prev);
      const current = new Set(next.get(subcategoryKey) || []);
      if (current.has(id)) {
        current.delete(id);
      } else {
        current.add(id);
      }
      if (current.size === 0) {
        next.delete(subcategoryKey);
      } else {
        next.set(subcategoryKey, current);
      }
      return next;
    });
    setNoneCategories(prev => {
      if (!prev.has(subcategoryKey)) return prev;
      const next = new Set(prev);
      next.delete(subcategoryKey);
      return next;
    });
  }, [onIngredientChange]);

  const handleToggleNone = useCallback((subcategoryKey: SubcategoryKey) => {
    const [type] = subcategoryKey.split(':');
    const isEquipment = type === 'equipment';

    setNoneCategories(prev => {
      const next = new Set(prev);
      if (next.has(subcategoryKey)) {
        next.delete(subcategoryKey);
      } else {
        next.add(subcategoryKey);
      }
      return next;
    });

    // Clear real selections in this subcategory when selecting "None"
    setSelectionsByCategory(prev => {
      const idsToRemove = prev.get(subcategoryKey);
      if (!idsToRemove || idsToRemove.size === 0) return prev;
      const next = new Map(prev);
      next.delete(subcategoryKey);

      if (isEquipment) {
        setSelectedEquipmentIds(prevIds => {
          const filtered = prevIds.filter(id => !idsToRemove.has(id));
          onEquipmentChange(filtered);
          return filtered;
        });
      } else {
        setSelectedIngredientIds(prevIds => {
          const filtered = prevIds.filter(id => !idsToRemove.has(id));
          onIngredientChange(filtered);
          return filtered;
        });
      }
      return next;
    });
  }, [onEquipmentChange, onIngredientChange]);

  const handleNext = useCallback(() => {
    if (buttonLabel === 'Finish') {
      onComplete();
      return;
    }

    // Advance to next unreviewed category, or just next in order
    const nextIndex = currentIndex + 1;
    if (nextIndex < categoryOrder.length) {
      setActiveCategory(categoryOrder[nextIndex]);
      // Stay in content view on mobile
      setMobileView('content');
    }
  }, [buttonLabel, currentIndex, categoryOrder, onComplete]);

  const handleCategorySelect = useCallback((category: SubcategoryKey) => {
    setActiveCategory(category);
    setMobileView('content');
  }, []);

  const handlePresetSelect = useCallback((presetKey: keyof typeof PRESET_KITS) => {
    const allEquipment = allEquipmentData?.data || [];
    const preset = PRESET_KITS[presetKey];
    const presetItems = allEquipment.filter(item => preset.equipment.includes(item.name));
    const presetIds = presetItems.map(item => item.id);

    setSelectedEquipmentIds(presetIds);
    onEquipmentChange(presetIds);

    // Map preset IDs to subcategories
    const newSelections = new Map<SubcategoryKey, Set<number>>();
    for (const item of presetItems) {
      const key: SubcategoryKey = `equipment:${item.subcategory}`;
      if (!newSelections.has(key)) {
        newSelections.set(key, new Set());
      }
      newSelections.get(key)!.add(item.id);
    }
    setSelectionsByCategory(newSelections);

    setShowPresetStep(false);
    setActiveCategory('equipment:essential');
    setMobileView('content');
  }, [allEquipmentData, onEquipmentChange]);

  const handleSkipPreset = useCallback(() => {
    setShowPresetStep(false);
  }, []);

  const handleSkipAll = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Phase 1: Preset Selection
  if (showPresetStep) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to MIXR!
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Start with an equipment preset, or set up everything manually.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {Object.entries(PRESET_KITS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handlePresetSelect(key as keyof typeof PRESET_KITS)}
                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-left"
              >
                <div className="text-3xl mb-3">{preset.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{preset.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {preset.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {preset.equipment.length} items
                </p>
              </button>
            ))}
          </div>

          <button
            onClick={handleSkipPreset}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
          >
            Skip — I'll choose manually
          </button>

          <div className="mt-6">
            <button
              onClick={handleSkipAll}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase 2: Master-Detail
  const detailTitle = activeCategory
    .split(':')[1]
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="container mx-auto px-4 py-8">
      <OnboardingProgress
        reviewedCount={reviewedCategories.size}
        totalCount={categoryOrder.length}
      />

      <MasterDetailLayout
        masterTitle="Your Bar Setup"
        masterWidth={280}
        stickyMaster={true}
        enableAnimations={true}
        contentKey={activeCategory}
        backButtonText="Categories"
        mobileView={mobileView}
        onBackToNavigation={() => setMobileView('navigation')}
        detailTitle={detailTitle}
        masterContent={
          <CategoryMasterPanel
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
            reviewedCategories={reviewedCategories}
            equipmentSubcategories={equipmentSubcategories}
            ingredientSubcategories={ingredientSubcategories}
            selectionCounts={selectionCounts}
          />
        }
        detailContent={
          <SubcategoryDetailPanel
            activeCategory={activeCategory}
            selectedEquipmentIds={selectedEquipmentIds}
            selectedIngredientIds={selectedIngredientIds}
            noneCategories={noneCategories}
            onToggleEquipment={handleToggleEquipment}
            onToggleIngredient={handleToggleIngredient}
            onToggleNone={handleToggleNone}
            onNext={handleNext}
            buttonLabel={buttonLabel}
            isNextDisabled={isNextDisabled}
          />
        }
      />

      <div className="mt-6 text-center">
        <button
          onClick={handleSkipAll}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
