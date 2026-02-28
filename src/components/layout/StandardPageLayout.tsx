import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppPageLayout } from '@sudobility/building_blocks';
import { useTopBarConfig } from './TopBar';
import { useFooterConfig } from './Footer';
import { type BreadcrumbItem } from './Breadcrumb';

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

// Link wrapper for breadcrumbs
const linkWrapper = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link to={href} className={className}>
    {children}
  </Link>
);

export const StandardPageLayout: FC<StandardPageLayoutProps> = ({
  children,
  className: _className = '',

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
  const topBarConfig = useTopBarConfig();
  const footerConfig = useFooterConfig(footerSticky ? 'compact' : 'full');

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

      <AppPageLayout
        topBar={topBarConfig}
        breadcrumbs={
          showBreadcrumb && breadcrumbItems && breadcrumbItems.length > 0
            ? {
                items: breadcrumbItems.map((item) => ({
                  label: item.label,
                  href: item.href,
                  current: item.current,
                })),
                LinkComponent: linkWrapper,
              }
            : undefined
        }
        footer={showFooter ? footerConfig : undefined}
        page={{ maxWidth, contentPadding, background }}
      >
        {children}
      </AppPageLayout>
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
