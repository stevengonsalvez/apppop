import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography, 
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  Description as DescriptionIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Rocket as RocketIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Analytics as AnalyticsIcon,
  Code as CodeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useHistory, useLocation } from 'react-router-dom';

// Define the documentation structure
const docStructure = {
  gettingStarted: [
    { title: 'Introduction', path: '/docs/introduction', icon: <HomeIcon /> },
    { title: 'Quick Start', path: '/docs/setup', icon: <RocketIcon /> },
    { title: 'Development Guide', path: '/docs/development', icon: <CodeIcon /> },
  ],
  guides: [
    { title: 'Authentication', path: '/docs/auth', icon: <SecurityIcon /> },
    { title: 'Theme System', path: '/docs/theme-system', icon: <PaletteIcon /> },
    { title: 'Components', path: '/docs/components', icon: <BuildIcon /> },
    { title: 'Profile System', path: '/docs/profile', icon: <SettingsIcon /> },
    { title: 'Google Analytics', path: '/docs/GoogleAnalytics', icon: <AnalyticsIcon /> },
    { title: 'GTM Setup', path: '/docs/gtm-setup', icon: <AnalyticsIcon /> },
    { title: 'GTM Usage Guide', path: '/docs/gtm-usage-guide', icon: <AnalyticsIcon /> },
    { title: 'Cookie Consent', path: '/docs/cookieconsent', icon: <SecurityIcon /> },
    { title: 'Monitoring', path: '/docs/monitoring', icon: <AnalyticsIcon /> },
    { title: 'Heatmap', path: '/docs/heatmap', icon: <AnalyticsIcon /> },
    { title: 'Analytics', path: '/docs/analytics', icon: <AnalyticsIcon /> },
    { title: 'CI/CD', path: '/docs/ci', icon: <CodeIcon /> },
  ]
};

interface DocNavigationProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onNavigate: (path: string) => void;
  onExitDocs: () => void;
}

export const DocNavigation: React.FC<DocNavigationProps> = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  onNavigate,
  onExitDocs
}) => {
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname === `/app${path}`;
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    onNavigate(path);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: [1],
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}>
        <Typography variant="h6" component="div" sx={{ 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <MenuBookIcon />
          Documentation
        </Typography>
        {isMobile && (
          <IconButton onClick={onDrawerToggle} color="inherit">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          fullWidth 
          onClick={onExitDocs}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to App
        </Button>
      </Box>
      
      <Divider />
      
      {/* Getting Started Section */}
      <Box sx={{ p: 2, pt: 3 }}>
        <Typography 
          variant="subtitle1" 
          component="div" 
          sx={{ 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            color: 'primary.main',
            mb: 1
          }}
        >
          <SchoolIcon fontSize="small" />
          GETTING STARTED
        </Typography>
      </Box>
      
      <List>
        {docStructure.gettingStarted.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{ 
                pl: 3,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Guides Section */}
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="subtitle1" 
          component="div" 
          sx={{ 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            color: 'primary.main',
            mb: 1
          }}
        >
          <DescriptionIcon fontSize="small" />
          GUIDES
        </Typography>
      </Box>
      
      <List sx={{ pb: 4 }}>
        {docStructure.guides.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{ 
                pl: 3,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}; 