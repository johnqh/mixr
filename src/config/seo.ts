import type { SEOHeadConfig } from '@sudobility/seo_lib';
import { CONSTANTS } from './constants';
import { SUPPORTED_LANGUAGES } from './languages';

export const seoHeadConfig: SEOHeadConfig = {
  appName: CONSTANTS.APP_NAME,
  baseUrl: `https://${CONSTANTS.APP_DOMAIN}`,
  defaultOgImage: `https://${CONSTANTS.APP_DOMAIN}/logo.png`,
  twitterHandle: undefined,
  supportedLanguages: [...SUPPORTED_LANGUAGES] as string[],
  defaultLanguage: 'en',
  applicationCategory: 'LifestyleApplication',
  applicationSubCategory: 'Cocktail Recipe Generator',
};
