import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoods } from '../../hooks/useMoods';
import { useGenerateRecipe } from '../../hooks/useGenerateRecipe';
import { useAuth } from '../../context/AuthContext';
import { MoodSelector } from '../mood/MoodSelector';
import { EquipmentSelector } from '../onboarding/EquipmentSelector';
import { IngredientSelector } from '../onboarding/IngredientSelector';

type Step = 'mood' | 'equipment' | 'ingredients';

const STEPS: Step[] = ['mood', 'equipment', 'ingredients'];

const STEP_CONFIG: Record<Step, { title: string; subtitle: string; icon: string }> = {
  mood: {
    title: 'Select Your Mood',
    subtitle: 'How are you feeling? This helps us craft the perfect cocktail for you.',
    icon: '✨',
  },
  equipment: {
    title: 'What Equipment Do You Have?',
    subtitle: 'Select the bar tools you have available.',
    icon: '🍸',
  },
  ingredients: {
    title: 'What Ingredients Do You Have?',
    subtitle: 'Select the spirits, mixers, and ingredients you have on hand.',
    icon: '🧊',
  },
};

export const RecipeGenerator: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('mood');
  const [selectedMoodId, setSelectedMoodId] = useState<number | null>(null);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<number[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>([]);

  const { data: moods = [], isLoading: loadingMoods } = useMoods();
  const { mutate: generateRecipe, isPending: isGenerating, error } = useGenerateRecipe();

  const stepIndex = STEPS.indexOf(currentStep);
  const isLastStep = stepIndex === STEPS.length - 1;

  const canProceed = () => {
    switch (currentStep) {
      case 'mood':
        return selectedMoodId !== null;
      case 'equipment':
        return selectedEquipmentIds.length > 0;
      case 'ingredients':
        return selectedIngredientIds.length > 0;
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleGenerate();
    } else {
      setCurrentStep(STEPS[stepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1]);
    }
  };

  const handleGenerate = () => {
    if (!selectedMoodId) return;

    generateRecipe(
      {
        mood_id: selectedMoodId,
        equipment_ids: selectedEquipmentIds,
        ingredient_ids: selectedIngredientIds,
      },
      {
        onSuccess: recipe => {
          navigate(`/recipes/${recipe.id}`);
        },
      }
    );
  };

  if (loadingMoods) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-6">🔒</div>
        <h2 className="text-3xl font-bold mb-4">Sign in to generate recipes</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Create an account to generate personalized cocktail recipes based on your mood
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Sign In
        </button>
      </div>
    );
  }

  const config = STEP_CONFIG[currentStep];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (i < stepIndex) setCurrentStep(step);
              }}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                ${i < stepIndex ? 'bg-purple-600 text-white cursor-pointer hover:bg-purple-700' : ''}
                ${i === stepIndex ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}
                ${i > stepIndex ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default' : ''}
              `}
            >
              {i < stepIndex ? '✓' : i + 1}
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-1 rounded ${
                  i < stepIndex ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">{config.icon}</div>
        <h2 className="text-3xl font-bold mb-3">{config.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">{config.subtitle}</p>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {currentStep === 'mood' && (
          <MoodSelector
            moods={moods}
            selectedMoodId={selectedMoodId}
            onMoodSelect={setSelectedMoodId}
            disabled={isGenerating}
          />
        )}

        {currentStep === 'equipment' && (
          <EquipmentSelector
            selectedIds={selectedEquipmentIds}
            onSelectionChange={setSelectedEquipmentIds}
          />
        )}

        {currentStep === 'ingredients' && (
          <IngredientSelector
            selectedIds={selectedIngredientIds}
            onSelectionChange={setSelectedIngredientIds}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                Generation failed
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error instanceof Error ? error.message : 'Failed to generate recipe. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className={`
            px-6 py-3 rounded-lg font-medium transition-colors
            ${stepIndex === 0
              ? 'invisible'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}
          `}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed() || isGenerating}
          className={`
            px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200
            ${
              !canProceed() || isGenerating
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isGenerating ? (
            <span className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating...
            </span>
          ) : isLastStep ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Generate Recipe
            </span>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </div>
  );
};
