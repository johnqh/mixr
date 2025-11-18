import { FC, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInfiniteRecipes } from '../hooks/useRecipes';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { RecipeFilters } from '../components/recipe/RecipeFilters';
import { RecipeGenerator } from '../components/recipe/RecipeGenerator';
import { useAuth } from '../context/AuthContext';

type Tab = 'browse' | 'generate' | 'my-recipes';

export const HomePage: FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteRecipes(20);

  // Flatten all pages of recipes
  const recipes = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.data || []);
  }, [data]);

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;

    const query = searchQuery.toLowerCase();
    return recipes.filter(recipe => {
      return (
        recipe.name.toLowerCase().includes(query) ||
        recipe.description?.toLowerCase().includes(query) ||
        recipe.mood?.name.toLowerCase().includes(query)
      );
    });
  }, [recipes, searchQuery]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'browse':
        return (
          <div>
            <RecipeFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-xl font-semibold mb-2">Failed to load recipes</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please try again later
                </p>
              </div>
            ) : (
              <RecipeGrid
                recipes={filteredRecipes}
                hasNextPage={hasNextPage && !searchQuery}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={searchQuery ? undefined : fetchNextPage}
              />
            )}
          </div>
        );

      case 'generate':
        return <RecipeGenerator />;

      case 'my-recipes':
        if (!user) {
          return (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🔒</div>
              <h2 className="text-3xl font-bold mb-4">Sign in to see your recipes</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Track your favorite recipes and the ones you've created
              </p>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Sign In
              </button>
            </div>
          );
        }

        return (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-3xl font-bold mb-4">Your Recipe Collection</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Save and organize your favorite cocktail recipes
            </p>
            <div className="inline-block px-6 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-medium">
              Personal collection coming soon!
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>MIXR - Discover & Create Amazing Cocktails</title>
        <meta name="description" content="Browse thousands of cocktail recipes or generate your perfect drink based on your mood" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🍸</span>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MIXR
                </h1>
              </div>

              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </span>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                  activeTab === 'browse'
                    ? 'bg-gray-50 dark:bg-gray-900 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse
                </div>
              </button>

              <button
                onClick={() => setActiveTab('generate')}
                className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                  activeTab === 'generate'
                    ? 'bg-gray-50 dark:bg-gray-900 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Generate
                </div>
              </button>

              <button
                onClick={() => setActiveTab('my-recipes')}
                className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                  activeTab === 'my-recipes'
                    ? 'bg-gray-50 dark:bg-gray-900 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  My Recipes
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default HomePage;
