import React, { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Button, 
  Container, 
  CssBaseline,
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../contexts/ThemeContext';
import { DocNavigation } from './DocNavigation';
import { themeConfig } from '../config/theme.config';
import { colorSchemes } from '../theme/colorScheme';
import { keyframes } from '@mui/material/styles';

const MotionBox = motion(Box);

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

const drawerWidth = 280;

interface DocumentationLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ 
  children,
  title = 'Documentation'
}) => {
  const history = useHistory();
  const muiTheme = useMuiTheme();
  const { isDarkMode, toggleDarkMode, setColorScheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Set the documentation color scheme when the component mounts
  useEffect(() => {
    // Save the current color scheme to restore it when unmounting
    const currentColorScheme = localStorage.getItem('colorScheme') || themeConfig.defaultColorScheme;
    
    // Set the documentation color scheme
    setColorScheme(themeConfig.documentationColorScheme);
    
    // Restore the original color scheme when unmounting
    return () => {
      setColorScheme(currentColorScheme);
    };
  }, [setColorScheme]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    history.push(`/app${path}`);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleExitDocs = () => {
    history.push('/app/dashboard');
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
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
            }}
            onClick={() => history.push('/')}
          >
            AppPop
          </Box>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              ml: 2,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button 
              color="inherit" 
              startIcon={<HomeIcon />}
              onClick={handleExitDocs}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Back to App
            </Button>
            
            <IconButton 
              color="inherit" 
              onClick={toggleDarkMode}
              sx={{ ml: 1 }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Documentation Navigation */}
      <DocNavigation
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        onNavigate={handleNavigation}
        onExitDocs={handleExitDocs}
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </MotionBox>
  );
}; 