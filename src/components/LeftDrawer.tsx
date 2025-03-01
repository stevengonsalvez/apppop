import { 
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Help as HelpIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  CreditCard as CreditCardIcon,
  Timeline as TimelineIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface LeftDrawerProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

const mainNavItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/home' },
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Search', icon: <SearchIcon />, path: '/search' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { text: 'Documentation', icon: <MenuBookIcon />, path: '/docs/introduction' },
];

const bottomNavItems = [
  { text: 'Support', icon: <HelpIcon />, path: '/support' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Plans', icon: <CreditCardIcon />, path: '/plans' },
  { text: 'Timeline', icon: <TimelineIcon />, path: '/timeline' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

export const LeftDrawer: React.FC<LeftDrawerProps> = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  onNavigate,
  onSignOut,
}) => {
  // Keep track of the last navigation to prevent duplicate clicks
  const [lastNavigation, setLastNavigation] = useState<{path: string, timestamp: number} | null>(null);
  // Track whether navigation is in progress
  const [navigating, setNavigating] = useState(false);

  // Handle navigation
  const handleNavigation = (path: string) => {
    // If we're already navigating or if this is a duplicate click, ignore
    if (navigating) return;
    
    // If we're already on this path, do nothing
    if (window.location.pathname === `/app${path}`) return;
    
    // Prevent duplicate navigation within a short time period
    const now = Date.now();
    if (lastNavigation && 
        lastNavigation.path === path && 
        now - lastNavigation.timestamp < 500) {
      return;
    }
    
    // Set navigating state to true to prevent re-renders
    setNavigating(true);
    
    // Update last navigation
    setLastNavigation({path, timestamp: now});
    
    // Block drawer re-rendering during navigation
    requestAnimationFrame(() => {
      // Navigate
      onNavigate(path);
      
      // Reset navigating state after a delay
      setTimeout(() => {
        setNavigating(false);
      }, 500);
    });
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <List>
        {mainNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              selected={window.location.pathname === `/app${item.path}`}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        {bottomNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              selected={window.location.pathname === `/app${item.path}`}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={onSignOut}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
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
            bgcolor: 'tertiary.main',
            color: 'tertiary.contrastText',
            '& .MuiListItemIcon-root': {
              color: 'tertiary.contrastText'
            }
          },
        }}
      >
        {!navigating && drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            bgcolor: 'tertiary.main',
            color: 'tertiary.contrastText',
            '& .MuiListItemIcon-root': {
              color: 'tertiary.contrastText'
            }
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}; 