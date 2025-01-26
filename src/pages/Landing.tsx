import { Box, Button, Stack } from '@mui/material';
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
        position: 'relative',
        backgroundImage: 'url("/splash.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          position: 'relative',
          zIndex: 2,
          p: 3,
          pb: 4,
          background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)',
        }}
      >
        <Stack 
          spacing={2} 
          sx={{ 
            width: '100%',
            maxWidth: '400px',
            mx: 'auto',
          }}
        >
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
                transform: 'translateY(-2px)',
              },
              transition: 'transform 0.2s',
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
              borderColor: 'common.white',
              color: 'common.white',
              borderWidth: 2,
              backdropFilter: 'blur(4px)',
              '&:hover': {
                borderColor: 'common.white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'transform 0.2s',
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