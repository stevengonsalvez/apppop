import { createTheme, Theme, alpha } from '@mui/material';
import { ColorScheme, colorSchemes, createPaletteFromScheme } from './colorScheme';
import { FontScheme, fontSchemes } from './fontScheme';

// Add tertiary to allowed button colors
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}

interface ThemeOptions {
  colorScheme?: ColorScheme;
  fontScheme?: FontScheme;
  isDarkMode?: boolean;
}

export const createAppTheme = ({ 
  colorScheme = colorSchemes.default, 
  fontScheme = fontSchemes.modern,
  isDarkMode = false 
}: ThemeOptions = {}): Theme => {
  const colors = isDarkMode ? colorScheme.dark : colorScheme.light;
  
  // Debug log to check colors
  console.log('Theme colors:', {
    tertiary: colors.tertiary,
    main: colors.tertiary.main,
  });
  
  const theme = createTheme({
    shape: {
      borderRadius: 16,
    },
    shadows: [
      'none',
      '0px 2px 8px rgba(0, 0, 0, 0.08)',
      '0px 4px 16px rgba(0, 0, 0, 0.12)',
      '0px 8px 24px rgba(0, 0, 0, 0.16)',
      '0px 16px 32px rgba(0, 0, 0, 0.20)',
      '0px 2px 4px rgba(0, 0, 0, 0.05)',
      '0px 3px 6px rgba(0, 0, 0, 0.08)',
      '0px 4px 8px rgba(0, 0, 0, 0.10)',
      '0px 5px 10px rgba(0, 0, 0, 0.12)',
      '0px 6px 12px rgba(0, 0, 0, 0.14)',
      '0px 7px 14px rgba(0, 0, 0, 0.16)',
      '0px 8px 16px rgba(0, 0, 0, 0.18)',
      '0px 9px 18px rgba(0, 0, 0, 0.20)',
      '0px 10px 20px rgba(0, 0, 0, 0.22)',
      '0px 11px 22px rgba(0, 0, 0, 0.24)',
      '0px 12px 24px rgba(0, 0, 0, 0.26)',
      '0px 13px 26px rgba(0, 0, 0, 0.28)',
      '0px 14px 28px rgba(0, 0, 0, 0.30)',
      '0px 15px 30px rgba(0, 0, 0, 0.32)',
      '0px 16px 32px rgba(0, 0, 0, 0.34)',
      '0px 17px 34px rgba(0, 0, 0, 0.36)',
      '0px 18px 36px rgba(0, 0, 0, 0.38)',
      '0px 19px 38px rgba(0, 0, 0, 0.40)',
      '0px 20px 40px rgba(0, 0, 0, 0.42)',
      '0px 21px 42px rgba(0, 0, 0, 0.44)',
    ] as Theme['shadows'],
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: colors.primary,
      secondary: colors.secondary,
      tertiary: colors.tertiary,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      success: colors.success,
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: colors.text,
      divider: alpha(colors.text.primary, 0.08),
      action: {
        active: alpha(colors.text.primary, 0.54),
        hover: alpha(colors.text.primary, 0.04),
        selected: alpha(colors.text.primary, 0.08),
        disabled: alpha(colors.text.primary, 0.26),
        disabledBackground: alpha(colors.text.primary, 0.12),
      },
    },
    typography: {
      fontFamily: fontScheme.fontFamily.primary,
      h1: {
        fontWeight: fontScheme.fontWeights.bold,
        letterSpacing: fontScheme.letterSpacing.tight,
      },
      h2: {
        fontWeight: fontScheme.fontWeights.bold,
        letterSpacing: fontScheme.letterSpacing.tight,
      },
      h3: {
        fontWeight: fontScheme.fontWeights.bold,
        letterSpacing: fontScheme.letterSpacing.tight,
      },
      h4: {
        fontWeight: fontScheme.fontWeights.semibold,
        letterSpacing: fontScheme.letterSpacing.normal,
      },
      h5: {
        fontWeight: fontScheme.fontWeights.semibold,
      },
      h6: {
        fontWeight: fontScheme.fontWeights.semibold,
      },
      button: {
        fontWeight: fontScheme.fontWeights.semibold,
        textTransform: 'none',
        letterSpacing: fontScheme.letterSpacing.wide,
      },
      body1: {
        fontWeight: fontScheme.fontWeights.regular,
        letterSpacing: fontScheme.letterSpacing.normal,
      },
      body2: {
        fontWeight: fontScheme.fontWeights.regular,
        letterSpacing: fontScheme.letterSpacing.normal,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            '--tertiary-main': colors.tertiary.main,
            '--tertiary-light': colors.tertiary.light,
            '--tertiary-dark': colors.tertiary.dark,
            '--tertiary-contrast-text': colors.tertiary.contrastText,
            '--surface': colors.background.surface,
            '--surface-variant': colors.background.surfaceVariant,
          },
          body: {
            backgroundColor: colors.background.default,
            color: colors.text.primary,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 24px',
            transition: 'all 0.2s ease-in-out',
            fontWeight: 600,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              backgroundColor: alpha(colors.primary.main, 0.04),
            },
          },
          containedPrimary: {
            background: `linear-gradient(45deg, ${colors.primary.main || '#1976d2'}, ${alpha(colors.primary.light || '#42a5f5', 0.9)})`,
            '&:hover': {
              background: `linear-gradient(45deg, ${colors.primary.dark || '#1565c0'}, ${colors.primary.main || '#1976d2'})`,
            },
          },
          containedSecondary: {
            background: `linear-gradient(45deg, ${colors.secondary.main || '#9c27b0'}, ${alpha(colors.secondary.light || '#ba68c8', 0.9)})`,
            '&:hover': {
              background: `linear-gradient(45deg, ${colors.secondary.dark || '#7b1fa2'}, ${colors.secondary.main || '#9c27b0'})`,
            },
          },
        },
        variants: [
          {
            props: { color: 'tertiary' as any },
            style: {
              background: `linear-gradient(45deg, var(--tertiary-main), var(--tertiary-light))`,
              color: 'var(--tertiary-contrast-text)',
              '&:hover': {
                background: `linear-gradient(45deg, var(--tertiary-dark), var(--tertiary-main))`,
              },
            },
          },
        ],
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: colors.background.paper,
            transition: 'all 0.2s ease-in-out',
            '&[data-surface="true"]': {
              backgroundColor: 'var(--surface)',
            },
            '&[data-surface-variant="true"]': {
              backgroundColor: 'var(--surface-variant)',
            },
          },
          elevation1: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          },
          elevation2: {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 1,
        },
        styleOverrides: {
          root: {
            borderRadius: 20,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            backgroundColor: alpha(colors.background.paper, 0.9),
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${alpha(colors.text.primary, 0.08)}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRight: `1px solid ${alpha(colors.text.primary, 0.08)}`,
            backgroundColor: `${colors.tertiary.main} !important`,
            backdropFilter: 'blur(8px)',
            color: colors.tertiary.contrastText || colors.text.primary,
            '& .MuiListItemText-primary': {
              color: colors.tertiary.contrastText || colors.text.primary,
            },
            '& .MuiListItemText-secondary': {
              color: alpha(colors.tertiary.contrastText || colors.text.primary, 0.7),
            },
            '& .MuiListItemIcon-root': {
              color: colors.tertiary.contrastText || colors.text.primary,
            },
            '& .MuiDivider-root': {
              borderColor: alpha(colors.tertiary.contrastText || colors.text.primary, 0.12),
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: colors.tertiary.main,
            },
          }),
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: alpha(colors.text.primary, 0.08),
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              backgroundColor: alpha(colors.text.primary, 0.04),
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: colors.primary.main,
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 2px ${alpha(colors.primary.main, 0.2)}`,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            '&.MuiChip-filled': {
              background: `linear-gradient(45deg, ${colors.primary.main || '#1976d2'}, ${alpha(colors.primary.light || '#42a5f5', 0.9)})`,
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            backgroundColor: alpha(colors.text.primary, 0.9),
            backdropFilter: 'blur(4px)',
          },
        },
      },
    },
  });

  return theme;
};

export const theme = createAppTheme(); 