import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { tagManager } from '../utils/tagManager';

interface LoginFormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, open: boolean, severity?: 'success' | 'error'}>({ 
    message: '', 
    open: false 
  });
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      setToast({
        message: 'Email verified successfully! You can now log in.',
        open: true,
        severity: 'success'
      });
    }
  }, [location]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(formData);
      if (error) throw error;
      
      // Get user ID after successful login
      const { data: { user } } = await supabase.auth.getUser();
      
      tagManager.pushEvent('login_success', {
        method: 'email',
        user_id: user?.id,
        email_domain: formData.email.split('@')[1],
        timestamp: new Date().toISOString()
      });
      
      history.push('/home');
    } catch (error: any) {
      tagManager.pushEvent('login_error', {
        method: 'email',
        error_type: error.name,
        error_message: error.message,
        timestamp: new Date().toISOString()
      });
      
      setToast({ 
        message: error.message,
        open: true,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const _handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      tagManager.pushEvent('social_login_start', {
        method: provider,
        timestamp: new Date().toISOString()
      });

      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      tagManager.pushEvent('social_login_success', {
        method: provider,
        user_id: user?.id,
        timestamp: new Date().toISOString()
      });
      
      history.push('/home');
    } catch (error: any) {
      tagManager.pushEvent('social_login_error', {
        method: provider,
        error_type: error.name,
        error_message: error.message,
        timestamp: new Date().toISOString()
      });
      
      setToast({ 
        message: 'An error occurred while logging in with social provider',
        open: true,
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      p: 2
    }}>
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              margin="normal"
              id="email"
              label="Email Address"
              variant="outlined"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 2, mb: 2, textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography color="primary" variant="body2">
                  Forgot your password?
                </Typography>
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 2,
                mb: 3,
                height: 48,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography color="primary" variant="body2">
                  Don't have an account? Sign up
                </Typography>
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={toast.severity || 'error'}
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};