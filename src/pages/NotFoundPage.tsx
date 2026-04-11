import { FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { CONSTANTS } from '../config/constants';

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('notFoundPage');

  return (
    <>
      <Helmet>
        <title>{t('seo.title', { appName: CONSTANTS.APP_NAME })}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="text-9xl mb-4">🍸</div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
              {t('heading')}
            </h1>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              {t('subheading')}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8">{t('description')}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('goBack')}
            </button>
            <Link
              to="/recipes"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium"
            >
              {t('browseRecipes')}
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('tryTheseLabel')}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/" className="text-purple-600 dark:text-purple-400 hover:underline">
                {t('links.home')}
              </Link>
              <Link to="/recipes" className="text-purple-600 dark:text-purple-400 hover:underline">
                {t('links.recipes')}
              </Link>
              <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
                {t('links.signIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
