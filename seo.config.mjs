/**
 * SEO configuration for MIXR.
 *
 * Used by generate-seo-assets.mjs from @johnqh/workflows to produce
 * per-route localized index.html files, sitemap.xml, and robots.txt.
 *
 * NOTE: This is a single-language (English only) app with non-language-prefixed
 * routes. The engine generates /:lang/path/index.html files, so with
 * supportedLanguages: ['en'], route path '/recipes' produces '/en/recipes/index.html'.
 */

const APP_NAME = process.env.VITE_APP_NAME || 'MIXR';

export default {
  supportedLanguages: ['en'],

  languageHreflangMap: {
    en: 'en',
  },

  primaryDomain: 'mixr.app',
  appName: APP_NAME,
  appDomain: process.env.VITE_APP_DOMAIN || 'mixr.app',
  robotsDisallowPaths: ['/login', '/register', '/settings', '/onboarding'],

  stripPatterns: [
    // Strip legacy WebSite SearchAction structured data if present
    /\n\s*<!-- Structured Data - WebSite with SearchAction -->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/,
  ],

  routes: [
    {
      key: 'landing',
      path: '',
      namespace: 'landingPage',
      priority: '1.0',
      changefreq: 'weekly',
      indexable: true,
      meta: locale => ({
        title: locale.landingPage.seo.title,
        description: locale.landingPage.seo.description,
        keywords: locale.landingPage.seo.keywords,
      }),
    },
    {
      key: 'recipes',
      path: '/recipes',
      namespace: 'homePage',
      priority: '0.9',
      changefreq: 'daily',
      indexable: true,
      meta: locale => ({
        title: locale.homePage.seo.title,
        description: locale.homePage.seo.description,
        keywords: locale.homePage.seo.keywords,
      }),
    },
    {
      key: 'login',
      path: '/login',
      namespace: 'loginPage',
      priority: '0.1',
      changefreq: 'monthly',
      indexable: false,
      meta: locale => ({
        title: locale.loginPage.seo.title,
        description: locale.loginPage.seo.description,
        keywords: [],
      }),
    },
    {
      key: 'register',
      path: '/register',
      namespace: 'registerPage',
      priority: '0.1',
      changefreq: 'monthly',
      indexable: false,
      meta: locale => ({
        title: locale.registerPage.seo.title,
        description: locale.registerPage.seo.description,
        keywords: [],
      }),
    },
    {
      key: 'settings',
      path: '/settings',
      namespace: 'settingsPage',
      priority: '0.1',
      changefreq: 'monthly',
      indexable: false,
      meta: locale => ({
        title: locale.settingsPage.seo.title,
        description: locale.settingsPage.seo.description,
        keywords: [],
      }),
    },
  ],
};
