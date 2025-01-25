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
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

interface RegistrationState {
  step: number;
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  marketingConsent: boolean;
}

const initialState: RegistrationState = {
  step: 1,
  email: '',
  password: '',
  fullName: '',
  dateOfBirth: '',
  marketingConsent: false
};

export const RegistrationPage: React.FC = () => {
  const [state, setState] = useState<RegistrationState>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{message: string, open: boolean}>({ message: '', open: false });

  const steps = ['Account', 'Personal Info', 'Preferences'];

  const handleNext = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleSubmit = async () => {
    try {
      const { user, error: signUpError } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,
      });

      if (signUpError) throw signUpError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: state.fullName,
          date_of_birth: state.dateOfBirth,
          marketing_email: state.marketingConsent,
          marketing_notifications: state.marketingConsent,
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      setToast({
        message: 'Registration successful! Please check your email to verify your account.',
        open: true
      });
    } catch (error: any) {
      setToast({
        message: error.message,
        open: true
      });
    }
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
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
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