import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRecipeById } from './useRecipes';
import { BreadcrumbBuilder, type BreadcrumbItem } from '../utils/BreadcrumbBuilder';

/**
 * Custom hook to generate breadcrumbs based on current location
 * Includes dynamic titles for recipe detail pages
 */
export const useBreadcrumbs = () => {
  const location = useLocation();
  const { id: recipeId } = useParams<{ id?: string }>();
  const breadcrumbBuilder = BreadcrumbBuilder.getInstance();

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
    return breadcrumbBuilder.getBreadcrumbItems(location.pathname, dynamicTitles);
  }, [breadcrumbBuilder, location.pathname, dynamicTitles]);

  const breadcrumbPaths = useMemo(() => {
    return breadcrumbBuilder.getBreadcrumbs(location.pathname, dynamicTitles);
  }, [breadcrumbBuilder, location.pathname, dynamicTitles]);

  const currentTitle = useMemo(() => {
    return breadcrumbBuilder.getBreadcrumbTitle(location.pathname, dynamicTitles);
  }, [breadcrumbBuilder, location.pathname, dynamicTitles]);

  return {
    items: breadcrumbItems as BreadcrumbItem[],
    paths: breadcrumbPaths,
    currentTitle,
  };
};
