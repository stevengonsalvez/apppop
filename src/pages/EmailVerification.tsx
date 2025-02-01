import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Box, Typography, CircularProgress, Container, Paper } from '@mui/material';

export const EmailVerification = () => {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from the URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const type = params.get('type');

        if (!token || type !== 'signup') {
          throw new Error('Invalid verification link');
        }

        // Verify the token
        const { error: verificationError } = await supabase.auth.verifyOTP({
          email: params.get('email') || '',
          token,
          type: 'signup'
        });

        if (verificationError) throw verificationError;

        // Wait a moment before redirecting
        setTimeout(() => {
          history.push('/login?verified=true');
        }, 2000);
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'Failed to verify email');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [history, location]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          {verifying ? (
            <>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>
                Verifying your email...
              </Typography>
            </>
          ) : error ? (
            <Typography color="error">
              {error}
            </Typography>
          ) : (
            <Typography color="success.main">
              Email verified successfully! Redirecting to login...
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}; 