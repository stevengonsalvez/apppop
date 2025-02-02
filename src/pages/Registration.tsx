import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Link, useHistory } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { TermsDialog } from '../components/TermsDialog';

interface RegistrationState {
  step: number;
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  marketing: {
    email: boolean;
    notifications: boolean;
  };
  termsAccepted: boolean;
}

const initialState: RegistrationState = {
  step: 1,
  email: '',
  password: '',
  fullName: '',
  dateOfBirth: '',
  marketing: {
    email: false,
    notifications: false
  },
  termsAccepted: false
};

export const RegistrationPage: React.FC = () => {
  const [state, setState] = useState<RegistrationState>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, open: boolean}>({ message: '', open: false });
  const history = useHistory();

  const updateField = (field: keyof RegistrationState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleSubmit = async () => {
    if (!state.termsAccepted) {
      setToast({
        message: 'Please accept the terms and conditions to continue',
        open: true
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Sign up with metadata
      const { user, error: signUpError } = await supabase.auth.signUp({
        email: state.email,
        password: state.password
      }, {
        data: {
          full_name: state.fullName
        }
      });

      console.log('Signup response:', { user, error: signUpError });
      if (signUpError) throw signUpError;
      if (!user) throw new Error('No user data returned');

      console.log('Attempting profile update for user:', user.id);
      console.log('State:', state);
      // 2. Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: state.fullName,
          date_of_birth: state.dateOfBirth,
          marketing_email: state.marketing.email,
          marketing_notifications: state.marketing.notifications,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      
      console.log('Profile update response:', { error: profileError });
      if (profileError) throw profileError;

      // 3. Sign out and redirect
      await supabase.auth.signOut();
      
      setToast({
        message: 'Registration successful! Please check your email to verify your account.',
        open: true
      });
      
      setTimeout(() => {
        history.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      setToast({
        message: error.message || 'An error occurred during registration. Please try again.',
        open: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTerms = () => {
    updateField('termsAccepted', true);
    setShowTerms(false);
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Create your account
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={state.email}
              onChange={e => updateField('email', e.target.value)}
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
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={state.password}
              onChange={e => updateField('password', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              sx={{ mt: 3 }}
              disabled={!state.email || !state.password}
            >
              Next
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Personal Information
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              value={state.fullName}
              onChange={e => updateField('fullName', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date of Birth"
              type="date"
              value={state.dateOfBirth}
              onChange={e => updateField('dateOfBirth', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CakeIcon color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!state.fullName || !state.dateOfBirth}
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Marketing Preferences
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.marketing.email}
                  onChange={e => updateField('marketing', { ...state.marketing, email: e.target.checked })}
                />
              }
              label="I agree to receive marketing communications"
            />
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.termsAccepted}
                    onChange={e => updateField('termsAccepted', e.target.checked)}
                  />
                }
                label={
                  <Box component="span">
                    I accept the{' '}
                    <Typography
                      component="span"
                      color="primary"
                      sx={{ 
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        '&:hover': {
                          color: 'primary.dark',
                        }
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowTerms(true);
                      }}
                    >
                      terms and conditions
                    </Typography>
                  </Box>
                }
              />
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!state.termsAccepted}
              >
                Complete Registration
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
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
        <Box>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Stepper activeStep={state.step - 1} alternativeLabel sx={{ mb: 4 }}>
              {['Account', 'Personal Info', 'Preferences'].map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {renderStep()}
            
            {state.step === 1 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography color="primary" variant="body2">
                    Already have an account? Sign in
                  </Typography>
                </Link>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>

      <TermsDialog
        open={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={toast.message.includes('successful') ? 'success' : 'error'}
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};