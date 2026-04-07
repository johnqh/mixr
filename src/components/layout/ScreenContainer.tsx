import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppPageLayout } from '@sudobility/building_blocks';
import { useTopBarConfig } from './TopBar';
import { useFooterConfig } from './Footer';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import { CONSTANTS } from '../../config/constants';
import { PageConfigProvider } from '../../context/PageConfigProvider';
import { usePageConfig } from '../../hooks/usePageConfig';

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

interface ScreenContainerProps {
  children: ReactNode;
}

/**
 * Page layout shell wrapping all routes at the route level.
 * Provides PageConfigProvider so child pages can use useSetPageConfig
 * for layout overrides.
 */
export function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <PageConfigProvider>
      <ScreenContainerInner>{children}</ScreenContainerInner>
    </PageConfigProvider>
  );
}

function ScreenContainerInner({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { items: breadcrumbItems } = useBreadcrumbs();
  const { pageConfig } = usePageConfig();

  const isHomePage = location.pathname === '/';

  const topBarConfig = useTopBarConfig();
  const footerConfig = useFooterConfig(isHomePage ? 'full' : 'compact');

  return (
    <AppPageLayout
      topBar={topBarConfig}
      breadcrumbs={
        breadcrumbItems.length > 0
          ? {
              items: breadcrumbItems,
              shareConfig: DEFAULT_SHARE_CONFIG,
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
      footer={footerConfig}
      page={{
        maxWidth: 'full',
        contentPadding: 'none',
        contentClassName: 'w-full min-w-0',
        ...pageConfig,
      }}
    >
      {children}
    </AppPageLayout>
  );
}

export default ScreenContainer;
