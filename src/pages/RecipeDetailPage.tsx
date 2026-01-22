import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useRecipeById } from '../hooks/useRecipes';
import { useAuth } from '../context/AuthContext';
import { useRecipeRatings, useRecipeRatingAggregate, useSubmitRating } from '../hooks/useRatings';
import { ReviewForm } from '../components/rating/ReviewForm';
import { ReviewList } from '../components/rating/ReviewList';
import { AggregateRating } from '../components/rating/AggregateRating';

export const RecipeDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const recipeId = Number(id);

  const { data: recipeData, isLoading, error } = useRecipeById(recipeId);
  const { data: ratings = [], isLoading: loadingRatings } = useRecipeRatings(recipeId, {
    limit: 20,
    sort: 'newest',
  });
  const { data: aggregateRating } = useRecipeRatingAggregate(recipeId);
  const { mutate: submitRating, isPending: isSubmittingRating } = useSubmitRating(recipeId);

  const handleSubmitRating = (stars: number, review?: string) => {
    submitRating({ stars, review });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !recipeData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Recipe not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/recipes')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Recipes
          </button>
        </div>
      </div>
    );
  }

  const recipe = recipeData.data;

  return (
    <>
      <Helmet>
        <title>{recipe.name} - MIXR</title>
        <meta name="description" content={recipe.description || `Learn how to make ${recipe.name}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Hero Image */}
            <div className="h-64 md:h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center text-9xl">
              🍸
            </div>

            {/* Recipe Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.name}</h1>
                  {recipe.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{recipe.description}</p>
                  )}
                </div>
                {recipe.mood && (
                  <div className="flex flex-col items-center ml-4">
                    <span className="text-5xl mb-1">{recipe.mood.emoji}</span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {recipe.mood.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{recipe.ingredients.length} ingredients</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{recipe.steps.length} steps</span>
                </div>
                {recipe.equipment && recipe.equipment.length > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span>{recipe.equipment.length} equipment</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  {ingredient.icon && <span className="text-2xl flex-shrink-0">{ingredient.icon}</span>}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {ingredient.amount}
                      </span>
                      <span className="font-medium">{ingredient.name}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment Section */}
          {recipe.equipment && recipe.equipment.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Equipment Needed
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recipe.equipment.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    {item.icon && <span className="text-2xl flex-shrink-0">{item.icon}</span>}
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Instructions
            </h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700 dark:text-gray-300">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Ratings & Reviews Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Ratings & Reviews
            </h2>

            {/* Aggregate Rating */}
            {aggregateRating && <AggregateRating aggregate={aggregateRating} />}

            {/* Review Form */}
            {user && (
              <ReviewForm
                recipeId={recipeId}
                onSubmit={handleSubmitRating}
                isSubmitting={isSubmittingRating}
              />
            )}

            {!user && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Sign in
                  </button>{' '}
                  to rate and review this recipe
                </p>
              </div>
            )}

            {/* Reviews List */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Community Reviews</h3>
              <ReviewList reviews={ratings} isLoading={loadingRatings} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeDetailPage;
