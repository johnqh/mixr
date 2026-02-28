import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppPageLayout } from '@sudobility/building_blocks';
import { useTopBarConfig } from './TopBar';
import { useFooterConfig } from './Footer';
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
  topbarVariant: _topbarVariant = 'default',
  showFooter = true,
  showBreadcrumbs = false,
  shareConfig,
}: ScreenContainerProps) {
  const { items: breadcrumbItems } = useBreadcrumbs();
  const effectiveShareConfig =
    shareConfig === false ? undefined : (shareConfig ?? DEFAULT_SHARE_CONFIG);

  const topBarConfig = useTopBarConfig();
  const footerConfig = useFooterConfig(footerVariant);

  return (
    <>
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

      <AppPageLayout
        topBar={topBarConfig}
        breadcrumbs={
          (showBreadcrumbs || effectiveShareConfig) && breadcrumbItems.length > 0
            ? {
                items: breadcrumbItems,
                shareConfig: effectiveShareConfig,
                LinkComponent: linkWrapper,
                talkToFounder: CONSTANTS.MEET_FOUNDER_URL
                  ? {
                      meetingUrl: CONSTANTS.MEET_FOUNDER_URL,
                      buttonText: 'Talk to Founder',
                    }
                  : undefined,
              }
            : undefined
        }
        footer={showFooter ? footerConfig : undefined}
        page={{ maxWidth: 'full', contentPadding: 'none' }}
      >
        {children}
      </AppPageLayout>
    </>
  );
}

export default ScreenContainer;
