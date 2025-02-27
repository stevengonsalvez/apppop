import { BrowserRouter as Router, Route, Redirect, useHistory, RouteComponentProps, Switch } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, IconButton } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';
import MenuIcon from '@mui/icons-material/Menu';
import { tagManager } from './utils/tagManager';
import './theme/variables.css';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProvider } from './contexts/UserContext';
import { useTheme } from './contexts/ThemeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { cookieManager } from './utils/cookieManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { supabase } from './utils/supabaseClient';
import { LeftDrawer } from './components/LeftDrawer';
import { BottomNav } from './components/BottomNav';
import { InteractiveLogo } from './components/InteractiveLogo';
import { LoginPage } from './pages/Login';
import { RegistrationPage } from './pages/Registration';
import ProfilePage from './pages/Profile';
import { LandingPage } from './pages/Landing';
import PlansPage from './pages/Plans';
import TimelinePage from './pages/Timeline';
import CheckoutPage from './pages/Checkout';
import { Plan, Addon } from './types/plan';
import StoriesPage from './pages/Stories';
import { HomePage } from './pages/Home';
import DashboardPage from './pages/Dashboard';
import { EmailVerification } from './pages/EmailVerification';
import { DocumentationPage } from './pages/Documentation';
import { keyframes } from '@mui/material/styles';

const textGlow = keyframes`
  0% {
    text-shadow: 0 0 4px rgba(254, 107, 139, 0.5);
    transform: scale(1);
  }
  25% {
    text-shadow: 0 0 10px rgba(254, 107, 139, 0.8), 0 0 20px rgba(255, 142, 83, 0.4);
    transform: scale(1.03) rotate(-1deg);
  }
  50% {
    text-shadow: 0 0 15px rgba(255, 142, 83, 0.8);
    transform: scale(1.05) rotate(1deg);
  }
  75% {
    text-shadow: 0 0 10px rgba(254, 107, 139, 0.8), 0 0 20px rgba(255, 142, 83, 0.4);
    transform: scale(1.03) rotate(-1deg);
  }
  100% {
    text-shadow: 0 0 4px rgba(254, 107, 139, 0.5);
    transform: scale(1);
  }
`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const drawerWidth = 240;

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
  // @ts-ignore
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
    history.push(`/app${path}`);
    setMobileOpen(false);
  };

  const handleLogoTextClick = () => {
    history.push('/app/dashboard');
  };

  useEffect(() => {
    tagManager.init();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    const handleRouteChange = () => {
      tagManager.pushEvent('page_view', {
        page_title: document.title,
        page_path: window.location.pathname,
        page_location: window.location.href
      });
    };

    // Track initial page view
    handleRouteChange();

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

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
            position: 'relative'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            position: 'absolute',
            left: { xs: 16, sm: 24 },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1
          }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 1, 
                display: { sm: 'none' },
                position: 'relative',
                zIndex: 2
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="span"
              sx={{
                fontFamily: "'Pacifico', ",
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                display: 'block',
                animation: `${textGlow} 4s infinite ease-in-out`,
                letterSpacing: '1px',
                cursor: 'pointer',
                ml: { xs: 0, sm: 0 }
              }}
              onClick={handleLogoTextClick}
            >
              AppPop
            </Box>
          </Box>
          <Box sx={{ 
            marginLeft: 'auto'
          }}>
            <InteractiveLogo 
              onThemeToggle={toggleDarkMode}
              isDarkMode={isDarkMode}
            />
          </Box>
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
        <Route exact path="/app/verify" component={EmailVerification} />
        <Route exact path="/app/home" component={HomePage} />
        <Route exact path="/app/profile" component={ProfilePage} />
        <Route exact path="/app/plans" component={PlansPage} />
        <Route exact path="/app/timeline" component={TimelinePage} />
        <Route exact path="/app/stories" component={StoriesPage} />
        <Route exact path="/app/checkout" component={CheckoutRoute} />
        <Route exact path="/app/dashboard" component={DashboardPage} />
        <Route exact path="/app">
          <Redirect to="/app/dashboard" />
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
    });

    cookieManager.initializeDefaultConsents();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserProvider>
      {!session ? (
        <Box>
          <Route exact path="/app/login">
            <LoginPage />
          </Route>
          <Route exact path="/app/register">
            <RegistrationPage />
          </Route>
          <Route exact path="/app/verify">
            <EmailVerification />
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
  useEffect(() => {
    tagManager.init();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    const handleRouteChange = () => {
      tagManager.pushEvent('page_view', {
        page_title: document.title,
        page_path: window.location.pathname,
        page_location: window.location.href
      });
    };

    // Track initial page view
    handleRouteChange();

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
            <Router>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/docs/:docPath" component={DocumentationPage} />
                <Route path="/app" component={AppContent} />
                <Route>
                  <Redirect to="/" />
                </Route>
              </Switch>
            </Router>
          </Box>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;