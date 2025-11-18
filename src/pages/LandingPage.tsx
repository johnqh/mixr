import { FC } from 'react';

const LandingPage: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🍹 MIXR
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8">
            Discover the perfect cocktail for your mood
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">😊</div>
            <h3 className="text-xl font-semibold mb-2">Mood-Based Recipes</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Select your mood and get personalized cocktail recommendations
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Your Inventory</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your equipment and ingredients for perfect matches
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">Community Ratings</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Rate recipes and see what others love
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600 dark:text-purple-300">
                1
              </div>
              <h4 className="font-semibold mb-2">Set Up Your Bar</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tell us what equipment and ingredients you have
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600 dark:text-purple-300">
                2
              </div>
              <h4 className="font-semibold mb-2">Choose Your Mood</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select how you're feeling today
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600 dark:text-purple-300">
                3
              </div>
              <h4 className="font-semibold mb-2">Get Mixing!</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Follow the recipe and enjoy your perfect cocktail
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Mixing?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join our community of cocktail enthusiasts today
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">
            Sign Up Free
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 MIXR. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="/terms" className="hover:text-purple-600">
              Terms
            </a>
            <a href="/privacy" className="hover:text-purple-600">
              Privacy
            </a>
            <a href="/about" className="hover:text-purple-600">
              About
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
