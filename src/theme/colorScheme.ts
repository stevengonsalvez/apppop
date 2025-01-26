import { PaletteOptions } from '@mui/material';

// Extend Material UI's palette to support tertiary colors
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

// Add tertiary to allowed button colors
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}

export interface ColorPalette {
  primary: {
    main: string;
    light?: string;
    dark?: string;
    contrastText?: string;
  };
  secondary: {
    main: string;
    light?: string;
    dark?: string;
    contrastText?: string;
  };
  tertiary: {
    main: string;
    light?: string;
    dark?: string;
    contrastText?: string;
  };
  background: {
    default: string;
    paper: string;
    surface: string;
    surfaceVariant?: string;
  };
  text: {
    primary: string;
    secondary?: string;
    disabled?: string;
  };
  error: {
    main: string;
    light?: string;
    dark?: string;
  };
  success?: {
    main: string;
    light?: string;
    dark?: string;
  };
  warning?: {
    main: string;
    light?: string;
    dark?: string;
  };
  info?: {
    main: string;
    light?: string;
    dark?: string;
  };
}

export interface ColorScheme {
  name: string;
  light: ColorPalette;
  dark: ColorPalette;
}

export const defaultColorScheme: ColorScheme = {
  name: 'default',
  light: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#00796b',
      light: '#26a69a',
      dark: '#004d40',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#f5f5f5',
      surfaceVariant: '#eeeeee',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      disabled: '#9e9e9e',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
  },
  dark: {
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#1a1a1a',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: '#1a1a1a',
    },
    tertiary: {
      main: '#80cbc4',
      light: '#b2dfdb',
      dark: '#4db6ac',
      contrastText: '#1a1a1a',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
      surface: '#242424',
      surfaceVariant: '#2c2c2c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#666666',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
    },
  },
};

export const indigoColorScheme: ColorScheme = {
  name: 'indigo',
  light: {
    primary: {
      main: '#3f51b5',
      light: '#6573c3',
      dark: '#363f5f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#00796b',
      light: '#26a69a',
      dark: '#004d40',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#f5f5f5',
      surfaceVariant: '#eeeeee',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      disabled: '#9e9e9e',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
  },
  dark: {
    primary: {
      main: '#7986cb',
      light: '#a7b6fc',
      dark: '#4a589e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff80ab',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#80cbc4',
      light: '#b2dfdb',
      dark: '#4db6ac',
      contrastText: '#1a1a1a',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
      surface: '#242424',
      surfaceVariant: '#2c2c2c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#666666',
    },
    error: {
      main: '#e57373',
      light: '#ff8a80',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
    },
  },
};

export const emeraldColorScheme: ColorScheme = {
  name: 'emerald',
  light: {
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0277bd',
      light: '#2979ff',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#00796b',
      light: '#26a69a',
      dark: '#004d40',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#f5f5f5',
      surfaceVariant: '#eeeeee',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      disabled: '#9e9e9e',
    },
    error: {
      main: '#c62828',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
  },
  dark: {
    primary: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4fc3f7',
      light: '#80d8ff',
      dark: '#0288d1',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#80cbc4',
      light: '#b2dfdb',
      dark: '#4db6ac',
      contrastText: '#1a1a1a',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
      surface: '#242424',
      surfaceVariant: '#2c2c2c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#666666',
    },
    error: {
      main: '#ef5350',
      light: '#ff8a80',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
    },
  },
};

export const sunsetColorScheme: ColorScheme = {
  name: 'sunset',
  light: {
    primary: {
      main: '#ff6b6b',
      light: '#ff8a80',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffd93d',
      light: '#ffe066',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#2d3436',
      light: '#4a4a4a',
      dark: '#1a1a1a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#f8f9fa',
      surfaceVariant: '#eeeeee',
    },
    text: {
      primary: '#2d3436',
      secondary: '#666666',
      disabled: '#9e9e9e',
    },
    error: {
      main: '#e74c3c',
      light: '#ff8a80',
      dark: '#e65100',
    },
    success: {
      main: '#ff6b6b',
      light: '#ff8a80',
      dark: '#e65100',
    },
    warning: {
      main: '#ffd93d',
      light: '#ffe066',
      dark: '#e65100',
    },
    info: {
      main: '#ff6b6b',
      light: '#ff8a80',
      dark: '#e65100',
    },
  },
  dark: {
    primary: {
      main: '#ff8787',
      light: '#ffb74d',
      dark: '#e65100',
      contrastText: '#1a1a1a',
    },
    secondary: {
      main: '#ffe066',
      light: '#ffe066',
      dark: '#e65100',
      contrastText: '#1a1a1a',
    },
    tertiary: {
      main: '#2d2d2d',
      light: '#4a4a4a',
      dark: '#1a1a1a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
      surface: '#2d2d2d',
      surfaceVariant: '#2c2c2c',
    },
    text: {
      primary: '#f8f9fa',
      secondary: '#b3b3b3',
      disabled: '#666666',
    },
    error: {
      main: '#ff6b6b',
      light: '#ffb74d',
      dark: '#e65100',
    },
    success: {
      main: '#ff6b6b',
      light: '#ffb74d',
      dark: '#e65100',
    },
    warning: {
      main: '#ffe066',
      light: '#ffe066',
      dark: '#e65100',
    },
    info: {
      main: '#ff6b6b',
      light: '#ffb74d',
      dark: '#e65100',
    },
  },
};

export const oceanColorScheme: ColorScheme = {
  name: 'ocean',
  light: {
    primary: {
      main: '#0099ff',
      light: '#42a5f5',
      dark: '#0073cc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00b8d4',
      light: '#40c4ff',
      dark: '#008394',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#00796b',
      light: '#26a69a',
      dark: '#004d40',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#f5f5f5',
      surfaceVariant: '#eeeeee',
    },
    text: {
      primary: '#263238',
      secondary: '#666666',
      disabled: '#9e9e9e',
    },
    error: {
      main: '#ff5252',
      light: '#ff8a80',
      dark: '#c51162',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
  },
  dark: {
    primary: {
      main: '#00b0ff',
      light: '#40c4ff',
      dark: '#0073cc',
      contrastText: '#1a1a1a',
    },
    secondary: {
      main: '#00e5ff',
      light: '#40c4ff',
      dark: '#008394',
      contrastText: '#1a1a1a',
    },
    tertiary: {
      main: '#00b0ff',
      light: '#40c4ff',
      dark: '#008394',
      contrastText: '#1a1a1a',
    },
    background: {
      default: '#102027',
      paper: '#1c313a',
      surface: '#242424',
      surfaceVariant: '#2c2c2c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#666666',
    },
    error: {
      main: '#ff5252',
      light: '#ff8a80',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
    },
  },
};

export const purpleRainColorScheme: ColorScheme = {
  name: 'purpleRain',
  light: {
    primary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#673ab7',
      light: '#9a67ea',
      dark: '#512da8',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#f3e5f5',
      light: '#f9f5ff',
      dark: '#e8eaf6',
      contrastText: '#1a1a1a',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#f3e5f5',
      surfaceVariant: '#eeeeee',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      disabled: '#9e9e9e',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
  },
  dark: {
    primary: {
      main: '#ba68c8',
      light: '#d89bdb',
      dark: '#9a00b0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7e57c2',
      light: '#a040a0',
      dark: '#512da8',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#311b92',
      light: '#4829b2',
      dark: '#1b0065',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
      surface: '#311b92',
      surfaceVariant: '#2c2c2c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#666666',
    },
    error: {
      main: '#e57373',
      light: '#ff8a80',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
    },
  },
};

export const mintColorScheme: ColorScheme = {
  name: 'mint',
  light: {
    primary: {
      main: '#00bfa5',
      light: '#42c7b8',
      dark: '#008c73',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1de9b6',
      light: '#4fc3f7',
      dark: '#00b8d4',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#00796b',
      light: '#26a69a',
      dark: '#004d40',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#e0f2f1',
      surfaceVariant: '#eeeeee',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      disabled: '#9e9e9e',
    },
    error: {
      main: '#ff5252',
      light: '#ff8a80',
      dark: '#c51162',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
  },
  dark: {
    primary: {
      main: '#1de9b6',
      light: '#4fc3f7',
      dark: '#00b8d4',
      contrastText: '#1a1a1a',
    },
    secondary: {
      main: '#64ffda',
      light: '#97ffff',
      dark: '#00b8d4',
      contrastText: '#1a1a1a',
    },
    tertiary: {
      main: '#00b0ff',
      light: '#40c4ff',
      dark: '#008394',
      contrastText: '#1a1a1a',
    },
    background: {
      default: '#102027',
      paper: '#1c313a',
      surface: '#242424',
      surfaceVariant: '#2c2c2c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#666666',
    },
    error: {
      main: '#ff5252',
      light: '#ff8a80',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
    },
  },
};

export const auroraScheme: ColorScheme = {
  name: 'aurora',
  light: {
    primary: {
      main: '#0079BF',
      light: '#5BA4CF',
      dark: '#004F7C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F76E5C',
      light: '#F9A08D',
      dark: '#D24F41',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#4BC27E',
      light: '#74D6A1',
      dark: '#38975D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F5F7',
      paper: '#FFFFFF',
      surface: '#EBEFF3',
      surfaceVariant: '#DDE4EB',
    },
    text: {
      primary: '#323232',
      secondary: '#5E6C77',
      disabled: '#A8B3BD',
    },
    error: {
      main: '#E53935',
      light: '#FF6B67',
      dark: '#AB000D',
    },
    warning: {
      main: '#FFB300',
      light: '#FFE54C',
      dark: '#C68400',
    },
    info: {
      main: '#1E88E5',
      light: '#6AB7FF',
      dark: '#005CB2',
    },
    success: {
      main: '#43A047',
      light: '#76D275',
      dark: '#00701A',
    },
  },
  dark: {
    primary: {
      main: '#5BA4CF',
      light: '#83C3E2',
      dark: '#0079BF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F9A08D',
      light: '#FFBFB3',
      dark: '#F76E5C',
      contrastText: '#000000',
    },
    tertiary: {
      main: '#74D6A1',
      light: '#9EEBC0',
      dark: '#4BC27E',
      contrastText: '#000000',
    },
    background: {
      default: '#1A1A1A',
      paper: '#2D2D2D',
      surface: '#333333',
      surfaceVariant: '#404040',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
      disabled: '#6C7A89',
    },
    error: {
      main: '#FF6B67',
      light: '#FF9D99',
      dark: '#E53935',
    },
    warning: {
      main: '#FFE54C',
      light: '#FFF7A0',
      dark: '#FFB300',
    },
    info: {
      main: '#6AB7FF',
      light: '#9DCEFF',
      dark: '#1E88E5',
    },
    success: {
      main: '#76D275',
      light: '#A2E8A1',
      dark: '#43A047',
    },
  },
};

export const tropicalBreezeScheme: ColorScheme = {
  name: 'tropicalBreeze',
  light: {
    primary: {
      main: '#F15BB5',
      light: '#FF85C0',
      dark: '#C5118E',
      contrastText: '#1B1B1B',
    },
    secondary: {
      main: '#00BBF9',
      light: '#66D6FF',
      dark: '#0089C6',
      contrastText: '#1B1B1B',
    },
    tertiary: {
      main: '#FFCC00',
      light: '#FFDD4F',
      dark: '#C79D00',
      contrastText: '#1B1B1B',
    },
    background: {
      default: '#F7F0E8',
      paper: '#F5E9DC',
      surface: '#FFEFD3',
      surfaceVariant: '#FBE2A9',
    },
    text: {
      primary: '#1B1B1B',
      secondary: '#3E3E3E',
      disabled: '#A8A8A8',
    },
    error: {
      main: '#FF4B3E',
      light: '#FF7A71',
      dark: '#D42E22',
    },
    warning: {
      main: '#FF9000',
      light: '#FFB04D',
      dark: '#CC7300',
    },
    info: {
      main: '#00BFFF',
      light: '#4DD2FF',
      dark: '#0095CC',
    },
    success: {
      main: '#00D97E',
      light: '#4DE4A4',
      dark: '#00AD65',
    },
  },
  dark: {
    primary: {
      main: '#FF85C0',
      light: '#FFADD5',
      dark: '#F15BB5',
      contrastText: '#1B1B1B',
    },
    secondary: {
      main: '#66D6FF',
      light: '#99E5FF',
      dark: '#00BBF9',
      contrastText: '#1B1B1B',
    },
    tertiary: {
      main: '#FFDD4F',
      light: '#FFE785',
      dark: '#FFCC00',
      contrastText: '#1B1B1B',
    },
    background: {
      default: '#1B1B1B',
      paper: '#2D2D2D',
      surface: '#333333',
      surfaceVariant: '#404040',
    },
    text: {
      primary: '#F7F0E8',
      secondary: '#D4C9BE',
      disabled: '#8C847B',
    },
    error: {
      main: '#FF7A71',
      light: '#FFA199',
      dark: '#FF4B3E',
    },
    warning: {
      main: '#FFB04D',
      light: '#FFC785',
      dark: '#FF9000',
    },
    info: {
      main: '#4DD2FF',
      light: '#85E0FF',
      dark: '#00BFFF',
    },
    success: {
      main: '#4DE4A4',
      light: '#85ECC0',
      dark: '#00D97E',
    },
  },
};

export const appPopColorScheme: ColorScheme = {
  name: 'appPop',
  light: {
    primary: {
      main: '#FFCC00', // Vibrant yellow
      light: '#FFEB66', // Light yellow
      dark: '#C79D00', // Dark yellow
      contrastText: '#1B1B1B', // Dark gray
    },
    secondary: {
      main: '#00BBF9', // Electric blue
      light: '#66D6FF', // Light blue
      dark: '#0089C6', // Dark blue
      contrastText: '#1B1B1B',
    },
    tertiary: {
      main: '#FFCC00', // Bold yellow
      light: '#FFDD4F', // Light yellow
      dark: '#C79D00', // Dark yellow
      contrastText: '#1B1B1B',
    },
    background: {
      default: '#00CFFD', // Vibrant aqua
      paper: '#0077B6', 
      surface: '#FF65A3', // Bold pink-magenta
      surfaceVariant: '#FFA500', // Vibrant orange for added fun
    },
    text: {
      primary: '#1B1B1B', // Dark gray
      secondary: '#3E3E3E', // Dark gray
      disabled: '#A8A8A8', // Light gray
    },
    error: {
      main: '#FF4B3E', // Bold red
      light: '#FF7A71', // Light red
      dark: '#D42E22', // Dark red
    },
    warning: {
      main: '#FF9000', // Bright orange
      light: '#FFB04D', // Light orange
      dark: '#CC7300',
    },
    info: {
      main: '#007BFF', // Electric blue
      light: '#66BFFF', // Light blue
      dark: '#0056A4', // Dark blue
    },
    success: {
      main: '#00E676', // Bright green
      light: '#66F599', // Light green
      dark: '#00B159', // Dark green
    },
  },
  dark: {
    primary: {
      main: '#FF85C0', // Light pink
      light: '#FFADD5', // Light pink
      dark: '#F15BB5', // Dark pink
      contrastText: '#1B1B1B',
    },
    secondary: {
      main: '#66D6FF', // Vibrant blue
      light: '#99E5FF', // Light blue
      dark: '#00BBF9', // Dark blue
      contrastText: '#1B1B1B', // Dark gray
    },
    tertiary: {
      main: '#FFDD4F', // Bright yellow
      light: '#FFE785', // Light yellow
      dark: '#FFCC00',
      contrastText: '#1B1B1B',
    },
    background: {
      default: '#1E293B', // Deep navy with vibrancy
      paper: '#4B5563',   // Mid-tone charcoal gray
      surface: '#8B5CF6', // Vivid violet for a daring touch
      surfaceVariant: '#D97706', // Bold amber-orange
    },
    text: {
      primary: '#F7F0E8', // Light gray
      secondary: '#D4C9BE', // Light gray
      disabled: '#8C847B', // Light gray
    },
    error: {
      main: '#FF7A71', // Bold red
      light: '#FFA199',
      dark: '#FF4B3E',
    },
    warning: {
      main: '#FFA500', // Bright orange
      light: '#FFC785', // Light orange
      dark: '#FF9000',
    },
    info: {
      main: '#66BFFF', // Vibrant sky blue
      light: '#85E0FF', // Light blue
      dark: '#007BFF',
    },
    success: {
      main: '#00E676', // Electric green
      light: '#66F599', // Light green
      dark: '#00B159',
    },
  },
};

export const colorSchemes = {
  default: defaultColorScheme,
  indigo: indigoColorScheme,
  emerald: emeraldColorScheme,
  sunset: sunsetColorScheme,
  ocean: oceanColorScheme,
  purpleRain: purpleRainColorScheme,
  mint: mintColorScheme,
  aurora: auroraScheme,
  tropicalBreeze: tropicalBreezeScheme,
  appPop: appPopColorScheme,
} as const;

export type ColorSchemeName = keyof typeof colorSchemes;

export const createPaletteFromScheme = (scheme: ColorScheme, isDark: boolean): PaletteOptions => {
  const colors = isDark ? scheme.dark : scheme.light;
  
  return {
    mode: isDark ? 'dark' : 'light',
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
  };
}; 