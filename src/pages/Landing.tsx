import { Box, Button, Stack, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { CookieConsentBanner } from '../components/CookieConsentBanner';

export const LandingPage: React.FC = () => {
  const history = useHistory();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      {/* Branding Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          textAlign: 'center',
        }}
      >
        {/* Hero Image */}
        <Box
          sx={{
            width: '100%',
            height: '60%',
            maxHeight: '400px',
            mb: 4,
            backgroundImage: 'url("/path-to-your-image.jpg")', // Replace with your image
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Branding Text */}
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Welcome to Template
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mb: 4 }}>
          Your modern, secure, and feature-rich application template
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          p: 3,
          width: '100%',
          maxWidth: '400px',
          mx: 'auto',
          mb: 4,
        }}
      >
        <Stack spacing={2}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => history.push('/login')}
            sx={{
              height: 48,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => history.push('/register')}
            sx={{
              height: 48,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'transparent',
              },
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Box>
      <CookieConsentBanner />
    </Box>
  );
}; 