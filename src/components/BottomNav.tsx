import { BottomNavigation, BottomNavigationAction, Paper, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  Home as HomeIcon, 
  Dashboard as DashboardIcon, 
  Search as SearchIcon, 
  Notifications as NotificationsIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { features } from '../pages/Dashboard';

interface BottomNavProps {
  value: number;
  onChange: (value: number) => void;
  onNavigate: (path: string) => void;
}

const navItems = [
  { icon: <HomeIcon />, label: 'Home', path: '/home' },
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
  { icon: <MenuBookIcon />, label: 'Docs', path: '/docs/introduction' },
  { icon: <SearchIcon />, label: 'Search', path: '/search' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ value, onChange, onNavigate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleChange = (_: any, newValue: number) => {
    // Prevent multiple navigation attempts in quick succession
    if (isNavigating) return;
    
    // If it's the Docs button (index 2), show the menu instead of navigating
    if (newValue === 2) {
      // Check if we're already on a docs page by looking at the current URL
      const isOnDocsPage = window.location.pathname.includes('/docs/');
      
      // If we're already on a docs page, just show the menu without changing the value or navigating
      if (isOnDocsPage) {
        const bottomNavElement = document.getElementById('bottom-nav');
        if (bottomNavElement) {
          setAnchorEl(bottomNavElement);
        }
        return;
      }
      
      // If we're not on a docs page, navigate to the introduction first
      setIsNavigating(true);
      onChange(newValue);
      onNavigate('/docs/introduction');
      
      // Reset navigation lock after a delay
      setTimeout(() => {
        setIsNavigating(false);
        
        // Delay showing the menu to prevent UI glitches
        const bottomNavElement = document.getElementById('bottom-nav');
        if (bottomNavElement) {
          setAnchorEl(bottomNavElement);
        }
      }, 500);
      
      return;
    }
    
    // For other navigation items
    setIsNavigating(true);
    onChange(newValue);
    onNavigate(navItems[newValue].path);
    
    // Reset navigation lock after a delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDocClick = (path: string) => {
    // Prevent navigation if already navigating
    if (isNavigating) {
      handleMenuClose();
      return;
    }
    
    setIsNavigating(true);
    onNavigate(path);
    handleMenuClose();
    
    // Reset navigation lock after a delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  };
  
  // Filter documentation items
  const docItems = features
    .filter(item => item.type === 'documentation')
    .map(item => ({
      text: item.title,
      path: item.markdownPath,
    }));

  return (
    <>
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          borderRadius: 0,
          background: (theme) => theme.palette.background.paper,
          boxShadow: 3,
          display: { sm: 'none' }
        }} 
        elevation={3}
        id="bottom-nav"
      >
        <BottomNavigation
          value={value}
          onChange={handleChange}
          sx={{
            bgcolor: 'background.paper',
          }}
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={item.label}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </BottomNavigation>
      </Paper>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {docItems.map((item) => (
          <MenuItem key={item.text} onClick={() => handleDocClick(item.path)}>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}; 