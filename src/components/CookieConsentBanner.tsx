import React, { useState, useEffect } from 'react';
import { cookieManager, CONSENT_CATEGORIES } from '../utils/cookieManager';
import { useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Switch,
  Paper,
  Snackbar,
  Alert,
  Stack,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const [tempConsents, setTempConsents] = useState(cookieManager.getConsents());

  useEffect(() => {
    if (isOpen) {
      setTempConsents(cookieManager.getConsents());
    }
  }, [isOpen]);

  const handleSave = () => {
    Object.entries(tempConsents).forEach(([categoryId, value]) => {
      cookieManager.setConsent(categoryId, value);
    });
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography component="div" variant="h5" fontWeight="bold">
          Cookie Preferences
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {CONSENT_CATEGORIES.map(category => (
            <Paper 
              key={category.id} 
              elevation={0}
              sx={{ 
                p: 2, 
                bgcolor: 'background.default',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {category.name}
                </Typography>
                {!category.required && (
                  <Switch
                    checked={tempConsents[category.id]}
                    onChange={e => setTempConsents(prev => ({
                      ...prev,
                      [category.id]: e.target.checked
                    }))}
                    color="primary"
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {category.detailedDescription}
              </Typography>
              {category.required && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Required for website functionality
                </Typography>
              )}
            </Paper>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" size="large">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" size="large">
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const CookieConsentBanner: React.FC = () => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isUnauthRoute = ['/login', '/signup', '/'].includes(location.pathname);
    const hasUnsetConsents = CONSENT_CATEGORIES.some(category => 
      !category.required && localStorage.getItem(`cookie_consent_${category.id}`) === null
    );
    
    setShowBanner(isUnauthRoute || hasUnsetConsents);
  }, [location.pathname]);

  const handleAcceptAll = () => {
    cookieManager.setAllConsent(true);
    setShowBanner(false);
  };

  const handleDeclineAll = () => {
    cookieManager.setAllConsent(false);
    setShowBanner(false);
  };

  const handleOpenPreferences = () => {
    setShowPreferences(true);
    setShowBanner(false); // Hide the banner when preferences dialog is open
  };

  if (!showBanner && !showPreferences) return null;

  return (
    <>
      <Snackbar
        open={showBanner}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiPaper-root': {
            maxWidth: 'md',
            width: '100%',
            m: 2,
          },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 2,
            width: '100%',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" gutterBottom>
              This website uses cookies to enhance your experience.
            </Typography>
            <Button
              onClick={handleOpenPreferences}
              color="primary"
              sx={{ textDecoration: 'underline', p: 0, minWidth: 'auto' }}
            >
              Manage Preferences
            </Button>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: { sm: '300px' } }}>
            <Button
              variant="outlined"
              onClick={handleDeclineAll}
              fullWidth
              size="large"
            >
              Reject All
            </Button>
            <Button
              variant="contained"
              onClick={handleAcceptAll}
              fullWidth
              size="large"
            >
              Accept All
            </Button>
          </Stack>
        </Paper>
      </Snackbar>

      <PreferencesModal 
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </>
  );
};