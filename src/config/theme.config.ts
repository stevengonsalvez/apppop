import { ColorSchemeName } from '../theme/colorScheme';
import { FontSchemeName } from '../theme/fontScheme';

interface ThemeConfig {
  defaultColorScheme: ColorSchemeName;
  defaultFontScheme: FontSchemeName;
  defaultDarkMode: boolean;
  persistTheme: boolean;
}

export const themeConfig: ThemeConfig = {
  defaultColorScheme: 'tropicalBreeze',
  defaultFontScheme: 'vibrantSans',
  defaultDarkMode: false, // Set to true to default to dark mode
  persistTheme: true, // Set to true to save theme preferences in localStorage
}; 