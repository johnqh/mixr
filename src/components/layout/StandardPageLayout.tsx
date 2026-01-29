import { FC, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  image?: string;
  type?: string;
}

interface StandardPageLayoutProps {
  children: ReactNode;
  className?: string;

  // SEO Props
  seo: SEOProps;

  // Header Props
  topBarVariant?: 'default' | 'app';

  // Breadcrumb Props
  breadcrumbItems?: BreadcrumbItem[];
  showBreadcrumb?: boolean;

  // Content Props
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';

  // Footer Props
  showFooter?: boolean;
  footerSticky?: boolean;

  // Background
  background?: 'default' | 'white' | 'gradient';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-4 sm:px-6 py-6',
  md: 'px-4 sm:px-6 lg:px-8 py-8',
  lg: 'px-4 sm:px-6 lg:px-8 py-12',
};

const backgroundClasses = {
  default: 'bg-gray-50 dark:bg-gray-900',
  white: 'bg-white dark:bg-gray-900',
  gradient: 'bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800',
};

export const StandardPageLayout: FC<StandardPageLayoutProps> = ({
  children,
  className = '',

  // SEO
  seo,

  // Header
  topBarVariant: _topBarVariant = 'default',

  // Breadcrumb
  breadcrumbItems,
  showBreadcrumb = true,

  // Content
  maxWidth = '7xl',
  contentPadding = 'md',

  // Footer
  showFooter = true,
  footerSticky = true,

  // Background
  background = 'default',
}) => {
  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords.join(', ')} />}
        {seo.canonical && <link rel="canonical" href={seo.canonical} />}
        {seo.image && <meta property="og:image" content={seo.image} />}
        {seo.type && <meta property="og:type" content={seo.type} />}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
      </Helmet>

      <div className={`min-h-screen flex flex-col ${backgroundClasses[background]} ${className}`}>
        {/* Header Section */}
        <TopBar />

        {/* Breadcrumb Section */}
        {showBreadcrumb && breadcrumbItems && breadcrumbItems.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-auto">
          <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[contentPadding]}`}>
            {children}
          </div>
        </main>

        {/* Footer */}
        {showFooter && <Footer variant={footerSticky ? 'compact' : 'full'} />}
      </div>
    </>
  );
};

// Optional: Compound component for content sections
export const StandardPageLayoutSection: FC<{
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}> = ({ children, className = '', title, subtitle }) => (
  <section className={`space-y-6 ${className}`}>
    {(title || subtitle) && (
      <div className="space-y-2">
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
        )}
        {subtitle && <p className="text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);
