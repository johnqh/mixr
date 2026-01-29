import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LayoutProvider } from '@sudobility/components';
import { AppBreadcrumbs } from '@sudobility/building_blocks';
import TopBar from './TopBar';
import Footer from './Footer';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import { CONSTANTS } from '../../config/constants';

interface ShareConfig {
  title: string;
  description: string;
  hashtags: string[];
}

const DEFAULT_SHARE_CONFIG: ShareConfig = {
  title: `${CONSTANTS.APP_NAME} - Discover Amazing Cocktails`,
  description: 'Find the perfect cocktail recipe based on your mood and ingredients.',
  hashtags: [CONSTANTS.APP_NAME, 'Cocktails', 'Mixology', 'Recipes'],
};

// Link wrapper for breadcrumbs
const LinkWrapper = ({
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

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  image?: string;
  type?: string;
}

interface ScreenContainerProps {
  children: ReactNode;
  seo?: SEOProps;
  footerVariant?: 'full' | 'compact';
  topbarVariant?: 'default' | 'transparent';
  showFooter?: boolean;
  showBreadcrumbs?: boolean;
  shareConfig?: ShareConfig | false;
}

export function ScreenContainer({
  children,
  seo,
  footerVariant = 'full',
  topbarVariant = 'default',
  showFooter = true,
  showBreadcrumbs = false,
  shareConfig,
}: ScreenContainerProps) {
  const { items: breadcrumbItems } = useBreadcrumbs();
  const effectiveShareConfig =
    shareConfig === false ? undefined : (shareConfig ?? DEFAULT_SHARE_CONFIG);

  return (
    <LayoutProvider mode="standard">
      {seo && (
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
      )}

      <div className="min-h-screen flex flex-col bg-theme-bg-primary">
        {/* Sticky header containing topbar and breadcrumbs */}
        <div className="sticky top-0 z-40">
          <TopBar variant={topbarVariant} />

          {(showBreadcrumbs || effectiveShareConfig) && breadcrumbItems.length > 0 && (
            <AppBreadcrumbs
              items={breadcrumbItems}
              shareConfig={effectiveShareConfig}
              LinkComponent={LinkWrapper}
              talkToFounder={
                CONSTANTS.MEET_FOUNDER_URL
                  ? {
                      meetingUrl: CONSTANTS.MEET_FOUNDER_URL,
                      buttonText: 'Talk to Founder',
                    }
                  : undefined
              }
            />
          )}
        </div>

        <main className="flex-1">{children}</main>

        {showFooter && <Footer variant={footerVariant} />}
      </div>
    </LayoutProvider>
  );
}

export default ScreenContainer;
