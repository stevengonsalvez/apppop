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
} from '@mui/icons-material';

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
];

const bottomNavItems = [
  { text: 'Support', icon: <HelpIcon />, path: '/support' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

export const LeftDrawer: React.FC<LeftDrawerProps> = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  onNavigate,
  onSignOut,
}) => {
  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <List>
        {mainNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => onNavigate(item.path)}>
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
            <ListItemButton onClick={() => onNavigate(item.path)}>
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
        {drawer}
      </Drawer>

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