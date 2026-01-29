export interface BreadcrumbPath {
  title: string;
  path: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

/**
 * Path to title mapping for mixr routes
 */
const pathTitles: Record<string, string> = {
  // Root paths
  '': 'Home',
  '/': 'Home',
  '/recipes': 'Recipes',
  '/settings': 'Settings',
  '/login': 'Login',
  '/register': 'Register',
  '/onboarding': 'Onboarding',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/contact': 'Contact',
  '/about': 'About',
};

/**
 * BreadcrumbBuilder - Singleton class for building breadcrumb trails
 */
export class BreadcrumbBuilder {
  private static instance: BreadcrumbBuilder;

  private constructor() {}

  public static getInstance(): BreadcrumbBuilder {
    if (!BreadcrumbBuilder.instance) {
      BreadcrumbBuilder.instance = new BreadcrumbBuilder();
    }
    return BreadcrumbBuilder.instance;
  }

  /**
   * Maps a path to a human-readable title
   */
  public getBreadcrumbTitle(path: string, dynamicTitles?: Record<string, string>): string {
    let normalizedPath = path;
    if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
      normalizedPath = normalizedPath.replace(/\/+$/, '');
    }

    // Check for dynamic titles (e.g., recipe names)
    if (dynamicTitles) {
      const normalizedPathLower = normalizedPath.toLowerCase();
      for (const [key, value] of Object.entries(dynamicTitles)) {
        if (key.toLowerCase() === normalizedPathLower) {
          return value;
        }
      }
    }

    // Check for static title
    const staticTitle = pathTitles[normalizedPath.toLowerCase()];
    if (staticTitle) {
      return staticTitle;
    }

    // Handle dynamic segments like /recipes/:id
    const segments = normalizedPath.split('/').filter(Boolean);

    // Check if this is a recipe detail page
    if (segments.length === 2 && segments[0] === 'recipes') {
      return 'Recipe Details';
    }

    // Fallback: capitalize the last segment
    const lastSegment = segments[segments.length - 1] || '';
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  }

  /**
   * Builds a complete breadcrumb trail for a given path
   */
  public getBreadcrumbs(path: string | undefined, dynamicTitles?: Record<string, string>): BreadcrumbPath[] {
    if (!path) return [];

    let cleanPath = path;
    if (cleanPath !== '/' && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.replace(/\/+$/, '');
    }

    // If we're at the home page, return Home only
    if (!cleanPath || cleanPath === '/') {
      return [
        {
          title: 'Home',
          path: '/',
        },
      ];
    }

    const segments = cleanPath.split('/').filter(Boolean);
    const result: BreadcrumbPath[] = [];

    // Always start with Home
    result.push({
      title: 'Home',
      path: '/',
    });

    // Build up the path for each segment
    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      const title = this.getBreadcrumbTitle(currentPath, dynamicTitles);
      result.push({
        title,
        path: currentPath,
      });
    }

    return result;
  }

  /**
   * Get breadcrumbs formatted for the AppBreadcrumbs component
   */
  public getBreadcrumbItems(path: string, dynamicTitles?: Record<string, string>): BreadcrumbItem[] {
    const breadcrumbs = this.getBreadcrumbs(path, dynamicTitles);

    return breadcrumbs.map((breadcrumb, index) => ({
      label: breadcrumb.title,
      href: index === breadcrumbs.length - 1 ? undefined : breadcrumb.path,
      current: index === breadcrumbs.length - 1,
    }));
  }
}
