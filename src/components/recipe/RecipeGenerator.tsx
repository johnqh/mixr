import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoods } from '../../hooks/useMoods';
import { useGenerateRecipe } from '../../hooks/useGenerateRecipe';
import { useAuth } from '../../context/AuthContext';
import { MoodSelector } from '../mood/MoodSelector';

export const RecipeGenerator: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMoodId, setSelectedMoodId] = useState<number | null>(null);

  const { data: moods = [], isLoading: loadingMoods } = useMoods();
  const { mutate: generateRecipe, isPending: isGenerating, error } = useGenerateRecipe();

  const handleGenerate = () => {
    if (!selectedMoodId) return;

    // For now, use empty arrays for equipment and ingredients
    // Later we can integrate with user's onboarding preferences
    generateRecipe(
      {
        mood_id: selectedMoodId,
        equipment_ids: [],
        ingredient_ids: [],
      },
      {
        onSuccess: recipe => {
          // Navigate to the generated recipe detail page
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-3xl font-bold mb-3">Generate Your Perfect Cocktail</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Select your mood and let AI create a unique recipe just for you
        </p>
      </div>

      {/* Mood Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <MoodSelector
          moods={moods}
          selectedMoodId={selectedMoodId}
          onMoodSelect={setSelectedMoodId}
          disabled={isGenerating}
        />
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

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={!selectedMoodId || isGenerating}
          className={`
            px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200
            ${
              !selectedMoodId || isGenerating
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            }
          `}
        >
          {isGenerating ? (
            <span className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating your recipe...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Generate Recipe
            </span>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400">
              AI-Powered Recipe Generation
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Our AI will create a unique cocktail recipe tailored to your selected mood, using ingredients and equipment you have available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
