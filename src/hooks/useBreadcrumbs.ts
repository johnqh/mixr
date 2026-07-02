import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRecipeById } from './useRecipes';
import { BreadcrumbBuilder, type BreadcrumbItem } from '../utils/BreadcrumbBuilder';
import { isLanguageSupported } from '../config/languages';

/**
 * Custom hook to generate breadcrumbs based on current location
 * Includes dynamic titles for recipe detail pages
 */
export const useBreadcrumbs = () => {
  const location = useLocation();
  const { id: recipeId } = useParams<{ id?: string }>();
  const breadcrumbBuilder = BreadcrumbBuilder.getInstance();

  // Routes are language-prefixed (e.g. /en/recipes). Strip the leading language
  // segment so breadcrumb titles/paths are built from the logical route
  // (/recipes) — the language prefix is re-added by the LocalizedLink wrapper.
  const routePath = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length > 0 && isLanguageSupported(segments[0])) {
      const rest = segments.slice(1).join('/');
      return rest ? `/${rest}` : '/';
    }
    return location.pathname;
  }, [location.pathname]);

  // Fetch recipe for dynamic title (only when on recipe detail page)
  const { data: recipeData } = useRecipeById(recipeId ? Number(recipeId) : 0);
  const recipe = recipeData?.data;

  // Build dynamic titles map
  const dynamicTitles = useMemo(() => {
    const titles: Record<string, string> = {};

    // Add recipe title if available
    if (recipeId && recipe?.name) {
      titles[`/recipes/${recipeId}`] = recipe.name;
    }

    return titles;
  }, [recipeId, recipe]);

  // Memoize breadcrumbs
  const breadcrumbItems = useMemo(() => {
    return breadcrumbBuilder.getBreadcrumbItems(routePath, dynamicTitles);
  }, [breadcrumbBuilder, routePath, dynamicTitles]);

  const breadcrumbPaths = useMemo(() => {
    return breadcrumbBuilder.getBreadcrumbs(routePath, dynamicTitles);
  }, [breadcrumbBuilder, routePath, dynamicTitles]);

  const currentTitle = useMemo(() => {
    return breadcrumbBuilder.getBreadcrumbTitle(routePath, dynamicTitles);
  }, [breadcrumbBuilder, routePath, dynamicTitles]);

  return {
    items: breadcrumbItems as BreadcrumbItem[],
    paths: breadcrumbPaths,
    currentTitle,
  };
};
