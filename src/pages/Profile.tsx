import { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { supabase } from '../utils/supabaseClient';
import { cookieManager } from '../utils/cookieManager';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  TextField,
  Paper,
  Switch,
  Button,
  Stack,
  Container,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  styled,
  alpha,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Camera as CameraIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(2),
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    '&.Mui-selected': {
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.9)})`,
      color: theme.palette.primary.contrastText,
      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
      '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
      },
      '& .MuiSvgIcon-root': {
        transform: 'scale(1.2)',
      },
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: theme.spacing(1),
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  fontWeight: 500,
  minWidth: 'unset',
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '1.25rem',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transform: 'translateY(-1px)',
  },
  '&.Mui-selected:hover': {
    transform: 'translateY(-1px)',
  },
  '& .button-content': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'visible',
  background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.05)}, ${theme.palette.background.paper})`,
  borderRadius: 32,
  padding: theme.spacing(4),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
  top: -50,
  left: '50%',
  transform: 'translateX(-50%)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateX(-50%) scale(1.05)',
    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
  },
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
  },
}));

const ProfilePage: React.FC = () => {
  const { profile, user, updateUserInContext } = useUserContext();
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState({
    full_name: profile?.full_name || '',
    date_of_birth: profile?.date_of_birth ? new Date(profile.date_of_birth) : null,
    marketing_email: profile?.marketing_email || false,
    marketing_notifications: profile?.marketing_notifications || false,
  });

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || '',
        date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth) : null,
        marketing_email: profile.marketing_email || false,
        marketing_notifications: profile.marketing_notifications || false,
      });
    }
  }, [profile]);

  const handleSignOut = async () => {
    cookieManager.clearAllConsents();
    await supabase.auth.signOut();
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name,
          date_of_birth: editedProfile.date_of_birth?.toISOString().split('T')[0] || null,
          marketing_email: editedProfile.marketing_email,
          marketing_notifications: editedProfile.marketing_notifications,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      updateUserInContext({
        ...profile,
        ...data,
      });

      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      pt: 12,
      pb: 4,
    }}>
      <Container maxWidth="sm">
        <ProfileCard>
          <ProfileAvatar>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ width: '100%', height: '100%', position: 'relative' }}
            >
              <PersonIcon sx={{ fontSize: 48, color: 'inherit' }} />
              <Tooltip title="Change Photo" arrow>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: -6,
                    right: -6,
                    backgroundColor: 'background.paper',
                    boxShadow: theme => `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                    '&:hover': {
                      backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                  size="small"
                >
                  <CameraIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </ProfileAvatar>

          <EditButton
            color="primary"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isSaving}
          >
            {isSaving ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditing ? (
              <SaveIcon />
            ) : (
              <EditIcon />
            )}
          </EditButton>

          <Box sx={{ mt: 8, mb: 4 }}>
            {error && (
              <Typography 
                color="error" 
                variant="body2" 
                align="center" 
                sx={{ mb: 2 }}
              >
                {error}
              </Typography>
            )}
            
            <Stack spacing={3} sx={{ maxWidth: 300, mx: 'auto' }}>
              {isEditing ? (
                <StyledTextField
                  value={editedProfile.full_name}
                  onChange={e => setEditedProfile(prev => ({
                    ...prev,
                    full_name: e.target.value
                  }))}
                  placeholder="Enter your name"
                  variant="outlined"
                  fullWidth
                  disabled={isSaving}
                />
              ) : (
                <Typography 
                  variant="h4" 
                  align="center"
                  sx={{ 
                    fontWeight: 600,
                    background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {profile?.full_name || 'Set your name'}
                </Typography>
              )}

              {isEditing ? (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={editedProfile.date_of_birth}
                    onChange={(newValue) => {
                      setEditedProfile(prev => ({
                        ...prev,
                        date_of_birth: newValue
                      }));
                    }}
                    disabled={isSaving}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        fullWidth: true,
                        disabled: isSaving,
                      },
                    }}
                  />
                </LocalizationProvider>
              ) : profile?.date_of_birth ? (
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <CalendarIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(profile.date_of_birth).toLocaleDateString()}
                  </Typography>
                </Stack>
              ) : null}
            </Stack>

            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center" 
              justifyContent="center"
              sx={{ mt: 1 }}
            >
              <EmailIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ mt: 6 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                mb: 3,
              }}
            >
              Marketing Preferences
            </Typography>
            <Stack spacing={3}>
              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center"
              >
                <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                  Email
                </Typography>
                <StyledToggleButtonGroup
                  value={editedProfile.marketing_email ? ['email'] : []}
                  onChange={(_, newValue) => {
                    setEditedProfile(prev => ({
                      ...prev,
                      marketing_email: !prev.marketing_email
                    }));
                  }}
                >
                  <StyledToggleButton value="email">
                    <span className="button-content">
                      {editedProfile.marketing_email ? (
                        <MarkEmailReadIcon color="inherit" />
                      ) : (
                        <MarkEmailUnreadIcon color="inherit" />
                      )}
                    </span>
                  </StyledToggleButton>
                </StyledToggleButtonGroup>
              </Stack>

              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center"
              >
                <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                  Notifications
                </Typography>
                <StyledToggleButtonGroup
                  value={editedProfile.marketing_notifications ? ['notifications'] : []}
                  onChange={(_, newValue) => {
                    setEditedProfile(prev => ({
                      ...prev,
                      marketing_notifications: !prev.marketing_notifications
                    }));
                  }}
                >
                  <StyledToggleButton value="notifications">
                    <span className="button-content">
                      {editedProfile.marketing_notifications ? (
                        <NotificationsActiveIcon color="inherit" />
                      ) : (
                        <NotificationsOffIcon color="inherit" />
                      )}
                    </span>
                  </StyledToggleButton>
                </StyledToggleButtonGroup>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ mt: 6 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              size="large"
              fullWidth
              sx={{
                borderRadius: 3,
                py: 1.5,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme => `0 8px 24px ${alpha(theme.palette.error.main, 0.25)}`,
                },
              }}
            >
              Sign Out
            </Button>
          </Box>
        </ProfileCard>
      </Container>
    </Box>
  );
};

export default ProfilePage;