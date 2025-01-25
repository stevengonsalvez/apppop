import { Redirect, Route } from 'react-router-dom';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { theme } from './theme/theme';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProvider } from './contexts/UserContext';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { cookieManager } from './utils/cookieManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { supabase } from './utils/supabaseClient';
import { LeftDrawer } from './components/LeftDrawer';
import { BottomNav } from './components/BottomNav';

import './theme/variables.css';

import { LoginPage } from './pages/Login';
import { RegistrationPage } from './pages/Registration';
import ProfilePage from './pages/Profile';
import { LandingPage } from './pages/Landing';
import { ThemeProvider as NewThemeProvider } from './contexts/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const drawerWidth = 240;

const mainNavItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/home' },
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Search', icon: <SearchIcon />, path: '/search' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
];

const AuthenticatedApp: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const history = useHistory();

  const handleSignOut = async () => {
    cookieManager.clearAllConsents();
    await supabase.auth.signOut();
  };

  const handleNavigation = (path: string) => {
    history.push(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              '& .MuiSvgIcon-root': {
                color: 'text.primary',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="text.primary">
            Template App
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton sx={{ color: 'text.primary' }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton sx={{ color: 'text.primary' }}>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <LeftDrawer
        drawerWidth={drawerWidth}
        mobileOpen={drawerOpen}
        onDrawerToggle={() => setDrawerOpen(!drawerOpen)}
        onNavigate={handleNavigation}
        onSignOut={handleSignOut}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
          mb: '56px',
        }}
      >
        <Route exact path="/home">
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
              Welcome to the Template App
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              This is your starting point. Customize this page as needed.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {mainNavItems.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.text}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
                    }}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {item.icon}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {item.text}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Access your {item.text.toLowerCase()} section
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Route>
        <Route exact path="/profile">
          <ProfilePage />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </Box>

      <BottomNav
        value={bottomNavValue}
        onChange={setBottomNavValue}
        onNavigate={handleNavigation}
      />
    </Box>
  );
};

const AppContent: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());
    const { data: authListener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
    });

    cookieManager.initializeDefaultConsents();

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <UserProvider>
      {!session ? (
        <Box>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegistrationPage />
          </Route>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route>
            <Redirect to="/" />
          </Route>
        </Box>
      ) : (
        <AuthenticatedApp />
      )}
    </UserProvider>
  );
};

const App: React.FC = () => {
  return (
    <NewThemeProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
          <Router>
            <AppContent />
          </Router>
        </Box>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </NewThemeProvider>
  );
};

export default App;