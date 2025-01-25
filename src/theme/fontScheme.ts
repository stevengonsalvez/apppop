export interface FontScheme {
  fontFamily: {
    primary: string;
    secondary?: string;
  };
  fontWeights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export const modernScheme: FontScheme = {
  fontFamily: {
    primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
  },
};

export const classicScheme: FontScheme = {
  fontFamily: {
    primary: '"Roboto", "Helvetica", "Arial", sans-serif',
    secondary: '"Roboto Slab", "Times New Roman", serif',
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0em',
    wide: '0.01em',
  },
};

export const minimalScheme: FontScheme = {
  fontFamily: {
    primary: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica", sans-serif',
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tight: '-0.015em',
    normal: '-0.005em',
    wide: '0.015em',
  },
};

export const vibrantSansScheme: FontScheme = {
  fontFamily: {
    primary: '"Poppins", "Arial", sans-serif',
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 700,
    bold: 800,
  },
  letterSpacing: {
    tight: '-0.015em',
    normal: '0em',
    wide: '0.025em',
  },
};

export const fontSchemes = {
  modern: modernScheme,
  classic: classicScheme,
  minimal: minimalScheme,
  vibrantSans: vibrantSansScheme,
} as const;

export type FontSchemeName = keyof typeof fontSchemes; 