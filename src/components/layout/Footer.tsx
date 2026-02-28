import { Link } from 'react-router-dom';
import { type FooterConfig, type FooterLinkSection } from '@sudobility/building_blocks';
import { SystemStatusIndicator, useNetwork } from '@sudobility/devops-components';
import { CONSTANTS } from '../../config/constants';

// Link wrapper for footer
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

export function useFooterConfig(variant: 'full' | 'compact'): FooterConfig {
  const currentYear = String(new Date().getFullYear());
  const { isOnline } = useNetwork();

  if (variant === 'compact') {
    return {
      variant: 'compact',
      version: CONSTANTS.APP_VERSION,
      copyrightYear: currentYear,
      companyName: CONSTANTS.COMPANY_NAME,
      companyUrl: '/',
      statusIndicator: CONSTANTS.STATUS_PAGE_URL
        ? {
            statusPageUrl: CONSTANTS.STATUS_PAGE_URL,
            apiEndpoint: CONSTANTS.STATUS_PAGE_API_URL,
            refreshInterval: 60000,
          }
        : undefined,
      StatusIndicatorComponent: SystemStatusIndicator,
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
      LinkComponent: linkWrapper,
      isNetworkOnline: isOnline,
      sticky: true,
    };
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

  return {
    variant: 'full',
    logo: {
      src: '/cocktail.png',
      appName: CONSTANTS.APP_NAME,
    },
    linkSections,
    socialLinks: CONSTANTS.SOCIAL_LINKS,
    statusIndicator: CONSTANTS.STATUS_PAGE_URL
      ? {
          statusPageUrl: CONSTANTS.STATUS_PAGE_URL,
          apiEndpoint: CONSTANTS.STATUS_PAGE_API_URL,
          refreshInterval: 60000,
        }
      : undefined,
    StatusIndicatorComponent: SystemStatusIndicator,
    version: CONSTANTS.APP_VERSION,
    copyrightYear: currentYear,
    companyName: CONSTANTS.COMPANY_NAME,
    description: 'Discover amazing cocktails and create your perfect drink based on your mood.',
    LinkComponent: linkWrapper,
    isNetworkOnline: isOnline,
    gridColumns: 3,
  };
}
