import { FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CONSTANTS } from '../config/constants';

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{`404 - Page Not Found | ${CONSTANTS.APP_NAME}`}</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl mb-4">🍸</div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              Page Not Found
            </p>
          </div>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Oops! The cocktail you're looking for seems to have been mixed up. This page doesn't exist.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Go Back
            </button>
            <Link
              to="/recipes"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium"
            >
              Browse Recipes
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Or try one of these:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Home
              </Link>
              <Link
                to="/recipes"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Browse Recipes
              </Link>
              <Link
                to="/login"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
