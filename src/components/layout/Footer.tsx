import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  isSticky?: boolean;
}

export const Footer: FC<FooterProps> = ({ isSticky = true }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerClasses = isSticky
    ? 'sticky bottom-0 z-40 bg-gray-900 text-white py-4 border-t border-gray-700'
    : 'relative z-10 bg-gray-900 text-white py-12';

  if (isSticky) {
    // Compact footer for app pages
    return (
      <footer className={footerClasses}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <span>
                &copy; {currentYear}{' '}
                <button
                  onClick={() => navigate('/')}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  MIXR
                </button>
                . All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6 text-sm">
              <button
                onClick={() => navigate('/privacy')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => navigate('/terms')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Full footer for landing pages
  return (
    <footer className={footerClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-4"
            >
              <span className="text-2xl">🍸</span>
              <span className="text-xl font-bold">MIXR</span>
            </button>
            <p className="text-gray-400 text-sm">
              Discover amazing cocktails and create your perfect drink based on your mood.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/recipes')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Browse Recipes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/recipes?tab=generate')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Generate Recipe
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/register')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Register
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/settings')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear}{' '}
            <button
              onClick={() => navigate('/')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              MIXR
            </button>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
