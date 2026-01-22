import type { ReactNode } from "react";
import {
  ThemeProvider as SharedThemeProvider,
  useTheme as useSharedTheme,
  Theme,
  FontSize,
} from "@sudobility/components";

// Re-export Theme and FontSize for consumers
export { Theme, FontSize } from "@sudobility/components";

export const useTheme = useSharedTheme;

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <SharedThemeProvider
      themeStorageKey="mixr-theme"
      fontSizeStorageKey="mixr-font-size"
      defaultTheme={Theme.LIGHT}
      defaultFontSize={FontSize.MEDIUM}
    >
      {children}
    </SharedThemeProvider>
  );
};
