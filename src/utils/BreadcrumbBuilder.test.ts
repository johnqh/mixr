import { describe, it, expect } from 'vitest';
import { BreadcrumbBuilder } from './BreadcrumbBuilder';

describe('BreadcrumbBuilder', () => {
  const builder = BreadcrumbBuilder.getInstance();

  describe('getInstance', () => {
    it('returns the same instance (singleton)', () => {
      const instance1 = BreadcrumbBuilder.getInstance();
      const instance2 = BreadcrumbBuilder.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getBreadcrumbTitle', () => {
    it('returns "Home" for root path', () => {
      expect(builder.getBreadcrumbTitle('/')).toBe('Home');
    });

    it('returns "Recipes" for /recipes', () => {
      expect(builder.getBreadcrumbTitle('/recipes')).toBe('Recipes');
    });

    it('returns "Settings" for /settings', () => {
      expect(builder.getBreadcrumbTitle('/settings')).toBe('Settings');
    });

    it('returns "Login" for /login', () => {
      expect(builder.getBreadcrumbTitle('/login')).toBe('Login');
    });

    it('returns "Recipe Details" for /recipes/:id', () => {
      expect(builder.getBreadcrumbTitle('/recipes/42')).toBe('Recipe Details');
    });

    it('uses dynamic titles when provided', () => {
      const dynamicTitles = { '/recipes/42': 'Classic Mojito' };
      expect(builder.getBreadcrumbTitle('/recipes/42', dynamicTitles)).toBe('Classic Mojito');
    });

    it('strips trailing slashes', () => {
      expect(builder.getBreadcrumbTitle('/recipes/')).toBe('Recipes');
    });

    it('falls back to capitalized last segment for unknown paths', () => {
      expect(builder.getBreadcrumbTitle('/unknown-page')).toBe('Unknown-page');
    });
  });

  describe('getBreadcrumbs', () => {
    it('returns only Home for root path', () => {
      const result = builder.getBreadcrumbs('/');
      expect(result).toEqual([{ title: 'Home', path: '/' }]);
    });

    it('returns empty array for undefined path', () => {
      const result = builder.getBreadcrumbs(undefined);
      expect(result).toEqual([]);
    });

    it('builds correct trail for /recipes', () => {
      const result = builder.getBreadcrumbs('/recipes');
      expect(result).toEqual([
        { title: 'Home', path: '/' },
        { title: 'Recipes', path: '/recipes' },
      ]);
    });

    it('builds correct trail for /recipes/:id', () => {
      const result = builder.getBreadcrumbs('/recipes/42');
      expect(result).toEqual([
        { title: 'Home', path: '/' },
        { title: 'Recipes', path: '/recipes' },
        { title: 'Recipe Details', path: '/recipes/42' },
      ]);
    });

    it('uses dynamic titles in trail', () => {
      const dynamicTitles = { '/recipes/42': 'Classic Mojito' };
      const result = builder.getBreadcrumbs('/recipes/42', dynamicTitles);
      expect(result[2].title).toBe('Classic Mojito');
    });
  });

  describe('getBreadcrumbItems', () => {
    it('marks the last item as current', () => {
      const items = builder.getBreadcrumbItems('/recipes');
      expect(items[items.length - 1].current).toBe(true);
    });

    it('provides href for non-current items', () => {
      const items = builder.getBreadcrumbItems('/recipes/42');
      expect(items[0].href).toBe('/');
      expect(items[1].href).toBe('/recipes');
      expect(items[2].href).toBeUndefined(); // current
    });

    it('sets correct labels', () => {
      const items = builder.getBreadcrumbItems('/settings');
      expect(items[0].label).toBe('Home');
      expect(items[1].label).toBe('Settings');
    });
  });
});
