import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createSimpleStorage } from '@sudobility/components';
import { Theme } from '@sudobility/types';
import { webStorage } from '@sudobility/di_web';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const storage = createSimpleStorage(webStorage);

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = storage.getItem('mixr-theme');
    return (saved as Theme) || Theme.LIGHT;
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    storage.setItem('mixr-theme', newTheme);
  };

  useEffect(() => {
    // Apply theme classes to document
    const root = document.documentElement;

    // Determine the actual theme to apply
    let actualTheme = theme;

    if (theme === Theme.SYSTEM) {
      // Detect system theme preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      actualTheme = prefersDark ? Theme.DARK : Theme.LIGHT;
    }

    // Apply theme class
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes when using system theme
    if (theme === Theme.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        const actualTheme = e.matches ? Theme.DARK : Theme.LIGHT;
        root.classList.remove('light', 'dark');
        root.classList.add(actualTheme);
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
