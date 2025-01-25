import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { createAppTheme } from '../theme/theme';
import { ColorSchemeName, colorSchemes } from '../theme/colorScheme';
import { themeConfig } from '../config/theme.config';

interface ThemeContextType {
  colorScheme: ColorSchemeName;
  isDarkMode: boolean;
  setColorScheme: (name: ColorSchemeName) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialColorScheme?: ColorSchemeName;
  initialDarkMode?: boolean;
}

const THEME_STORAGE_KEY = 'app-theme-preferences';

interface StoredThemePreferences {
  colorScheme: ColorSchemeName;
  isDarkMode: boolean;
}

const getStoredPreferences = (): StoredThemePreferences | null => {
  if (!themeConfig.persistTheme) return null;
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const storePreferences = (preferences: StoredThemePreferences) => {
  if (!themeConfig.persistTheme) return;
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences));
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialColorScheme = themeConfig.defaultColorScheme,
  initialDarkMode = themeConfig.defaultDarkMode,
}) => {
  const storedPreferences = getStoredPreferences();
  
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    storedPreferences?.colorScheme ?? initialColorScheme
  );
  const [isDarkMode, setIsDarkMode] = useState(
    storedPreferences?.isDarkMode ?? initialDarkMode
  );

  useEffect(() => {
    storePreferences({ colorScheme, isDarkMode });
  }, [colorScheme, isDarkMode]);

  const theme = React.useMemo(
    () => createAppTheme({
      colorScheme: colorSchemes[colorScheme],
      isDarkMode,
    }),
    [colorScheme, isDarkMode]
  );

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const value = React.useMemo(
    () => ({
      colorScheme,
      isDarkMode,
      setColorScheme,
      toggleDarkMode,
    }),
    [colorScheme, isDarkMode, toggleDarkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 