import { Link } from 'react-router-dom';
import { AppFooter, AppFooterForHomePage, type FooterLinkSection } from '@sudobility/building_blocks';
import { SystemStatusIndicator, useNetwork } from '@sudobility/devops-components';
import { CONSTANTS } from '../../config/constants';

interface FooterProps {
  variant?: 'full' | 'compact';
}

// Link wrapper for footer
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

export function Footer({ variant = 'full' }: FooterProps) {
  const currentYear = String(new Date().getFullYear());
  const { isOnline } = useNetwork();

  if (variant === 'compact') {
    return (
      <AppFooter
        version={CONSTANTS.APP_VERSION}
        copyrightYear={currentYear}
        companyName={CONSTANTS.COMPANY_NAME}
        companyUrl="/"
        statusIndicator={
          CONSTANTS.STATUS_PAGE_URL
            ? {
                statusPageUrl: CONSTANTS.STATUS_PAGE_URL,
                apiEndpoint: CONSTANTS.STATUS_PAGE_API_URL,
                refreshInterval: 60000,
              }
            : undefined
        }
        StatusIndicatorComponent={SystemStatusIndicator}
        links={[
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
        ]}
        LinkComponent={LinkWrapper}
        isNetworkOnline={isOnline}
        sticky
      />
    );
  }

  const linkSections: FooterLinkSection[] = [
    {
      title: 'Explore',
      links: [
        { label: 'Browse Recipes', href: '/recipes' },
        { label: 'Generate Recipe', href: '/recipes?tab=generate' },
        { label: 'About', href: '/about' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign In', href: '/login' },
        { label: 'Register', href: '/register' },
        { label: 'Settings', href: '/settings' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ];

  return (
    <AppFooterForHomePage
      logo={{
        src: '/cocktail.png',
        appName: CONSTANTS.APP_NAME,
      }}
      linkSections={linkSections}
      socialLinks={CONSTANTS.SOCIAL_LINKS}
      statusIndicator={
        CONSTANTS.STATUS_PAGE_URL
          ? {
              statusPageUrl: CONSTANTS.STATUS_PAGE_URL,
              apiEndpoint: CONSTANTS.STATUS_PAGE_API_URL,
              refreshInterval: 60000,
            }
          : undefined
      }
      StatusIndicatorComponent={SystemStatusIndicator}
      version={CONSTANTS.APP_VERSION}
      copyrightYear={currentYear}
      companyName={CONSTANTS.COMPANY_NAME}
      description="Discover amazing cocktails and create your perfect drink based on your mood."
      LinkComponent={LinkWrapper}
      isNetworkOnline={isOnline}
      gridColumns={3}
    />
  );
}

export default Footer;
