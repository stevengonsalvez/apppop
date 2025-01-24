import { useState } from 'react';
import { IonContent, IonPage, useIonToast, useIonLoading } from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory, Link } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

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
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const history = useHistory();

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

    await showLoading();
    try {
      const { error } = await supabase.auth.signIn(formData);
      if (error) throw error;
      
      history.push('/home');
    } catch (error: any) {
      await showToast({ 
        message: error.message,
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
                  Sign In
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
          </Box>
        </Container>
      </IonContent>
    </IonPage>
  );
};