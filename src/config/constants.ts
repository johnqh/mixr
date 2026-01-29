import packageJson from '../../package.json';

// App Constants
export const CONSTANTS = {
  // Branding
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MIXR',
  APP_DOMAIN: import.meta.env.VITE_APP_DOMAIN || 'mixr.app',
  COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME || 'Sudobility',
  APP_VERSION: packageJson.version,
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'support@mixr.app',

  // API
  API_URL: import.meta.env.VITE_MIXR_API_URL || 'http://localhost:3000',

  // Dev Mode
  DEV_MODE: import.meta.env.DEV,

  // Social links (full URLs) - property names must match SocialLinksConfig from building_blocks
  SOCIAL_LINKS: {
    twitterUrl: import.meta.env.VITE_TWITTER_URL || '',
    discordUrl: import.meta.env.VITE_DISCORD_URL || '',
    linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || '',
    githubUrl: import.meta.env.VITE_GITHUB_URL || '',
  },

  // External pages
  STATUS_PAGE_URL: import.meta.env.VITE_STATUS_PAGE_URL || '',
  STATUS_PAGE_API_URL: import.meta.env.VITE_STATUS_PAGE_URL
    ? `${import.meta.env.VITE_STATUS_PAGE_URL}/api/v2/status.json`
    : '',

  // Founder meeting link (e.g., Cal.com, Calendly)
  MEET_FOUNDER_URL: import.meta.env.VITE_MEET_FOUNDER_URL || '',
} as const;
