import { ColorSchemeName } from '../theme/colorScheme';
import { FontSchemeName } from '../theme/fontScheme';

interface ThemeConfig {
  defaultColorScheme: ColorSchemeName;
  defaultFontScheme: FontSchemeName;
  defaultDarkMode: boolean;
  persistTheme: boolean;
}

export const themeConfig: ThemeConfig = {
  defaultColorScheme: 'purpleRain',
  defaultFontScheme: 'vibrantSans',
  defaultDarkMode: false,
  persistTheme: false,
}; 