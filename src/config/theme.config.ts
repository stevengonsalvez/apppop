import { ColorSchemeName } from '../theme/colorScheme';
import { FontSchemeName } from '../theme/fontScheme';

interface ThemeConfig {
  defaultColorScheme: ColorSchemeName;
  defaultFontScheme: FontSchemeName;
  defaultDarkMode: boolean;
  persistTheme: boolean;
  documentationColorScheme: ColorSchemeName;
}

export const themeConfig: ThemeConfig = {
  defaultColorScheme: 'appPop',
  defaultFontScheme: 'vibrantSans',
  defaultDarkMode: false,
  persistTheme: false,
  documentationColorScheme: 'purpleRain',
}; 