import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
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
import { useTheme } from './contexts/ThemeContext';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { cookieManager } from './utils/cookieManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { supabase } from './utils/supabaseClient';
import { LeftDrawer } from './components/LeftDrawer';
import { BottomNav } from './components/BottomNav';
import { InteractiveLogo } from './components/InteractiveLogo';

import './theme/variables.css';

import { LoginPage } from './pages/Login';
import { RegistrationPage } from './pages/Registration';
import ProfilePage from './pages/Profile';
import { LandingPage } from './pages/Landing';
import PlansPage from './pages/Plans';
import TimelinePage from './pages/Timeline';
import { ThemeProvider as NewThemeProvider } from './contexts/ThemeContext';
import CheckoutPage from './pages/Checkout';
import { Plan, Addon } from './types/plan';
import StoriesPage from './pages/Stories';
import { HomePage } from './pages/Home';
import { EmailVerification } from './pages/EmailVerification';

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

interface CheckoutLocationState {
  selectedPlan: Plan;
  selectedAddons: Addon[];
}

const CheckoutRoute: React.FC<RouteComponentProps<{}, {}, CheckoutLocationState>> = (props) => (
  <CheckoutPage 
    selectedPlan={props.location.state?.selectedPlan}
    selectedAddons={props.location.state?.selectedAddons || []}
  />
);

const AuthenticatedApp: React.FC = () => {
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleNavigation = (path: string) => {
    history.push(path);
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between', 
            minHeight: { xs: 70, sm: 70 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <InteractiveLogo 
            onThemeToggle={toggleDarkMode}
            isDarkMode={isDarkMode}
          />
        </Toolbar>
      </AppBar>
      <LeftDrawer
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        onNavigate={handleNavigation}
        onSignOut={handleSignOut}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: ['56px', '64px'],
          mb: ['56px', 0],
        }}
      >
        <Route exact path="/verify" component={EmailVerification} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/plans" component={PlansPage} />
        <Route exact path="/timeline" component={TimelinePage} />
        <Route exact path="/stories" component={StoriesPage} />
        <Route 
          exact 
          path="/checkout" 
          component={CheckoutRoute}
        />
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
          <Route exact path="/verify">
            <EmailVerification />
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