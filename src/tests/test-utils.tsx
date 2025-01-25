import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { UserProvider } from '../contexts/UserContext';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from '../theme/theme';

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {ui}
          </Box>
        </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}