import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';
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
  CircularProgress,
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
  marketingConsent: boolean;
  termsAccepted: boolean;
}

const initialState: RegistrationState = {
  step: 1,
  email: '',
  password: '',
  fullName: '',
  dateOfBirth: '',
  marketingConsent: false,
  termsAccepted: false
};

export const RegistrationPage: React.FC = () => {
  const [state, setState] = useState<RegistrationState>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [toast, setToast] = useState<{message: string, open: boolean}>({ message: '', open: false });
  const [loading, setLoading] = useState(false);

  const steps = ['Account', 'Personal Info', 'Preferences'];

  const handleNext = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleSubmit = async () => {
    console.log('Submit button clicked');
    if (!state.termsAccepted) {
      setToast({
        message: 'Please accept the terms and conditions to continue',
        open: true
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting to sign up...');
      // First create the user
      const { user, error: signUpError } = await supabase.auth.signUp({
        email: state.email,
        password: state.password
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (!user) {
        throw new Error('No user returned from signup');
      }

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Then update the profile directly
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: state.fullName,
          date_of_birth: state.dateOfBirth,
          marketing_email: state.marketingConsent,
          marketing_notifications: state.marketingConsent,
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't throw the error as the user is still created
        console.warn('Profile update failed, but user was created');
      }

      console.log('Registration complete');
      setToast({
        message: 'Registration successful! Please check your email to verify your account.',
        open: true
      });
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

  const handleOpenTerms = () => {
    setShowTerms(true);
  };

  const handleCloseTerms = () => {
    setShowTerms(false);
  };

  const handleAcceptTerms = () => {
    setState(prev => ({ ...prev, termsAccepted: true }));
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
              onChange={e => setState(prev => ({ ...prev, email: e.target.value }))}
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
              onChange={e => setState(prev => ({ ...prev, password: e.target.value }))}
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
              onChange={e => setState(prev => ({ ...prev, fullName: e.target.value }))}
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
              onChange={e => setState(prev => ({ ...prev, dateOfBirth: e.target.value }))}
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
                  checked={state.marketingConsent}
                  onChange={e => setState(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                />
              }
              label="I agree to receive marketing communications"
            />
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.termsAccepted}
                    onChange={e => setState(prev => ({ ...prev, termsAccepted: e.target.checked }))}
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
                        handleOpenTerms();
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
                disabled={!state.termsAccepted || loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Complete Registration'
                )}
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
              {steps.map((label) => (
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
        onClose={handleCloseTerms}
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