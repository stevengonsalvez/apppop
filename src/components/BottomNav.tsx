import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home as HomeIcon, Dashboard as DashboardIcon, Search as SearchIcon, Notifications as NotificationsIcon } from '@mui/icons-material';

interface BottomNavProps {
  value: number;
  onChange: (value: number) => void;
  onNavigate: (path: string) => void;
}

const navItems = [
  { icon: <HomeIcon />, label: 'Home', path: '/home' },
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
  { icon: <SearchIcon />, label: 'Search', path: '/search' },
  { icon: <NotificationsIcon />, label: 'Notifications', path: '/notifications' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ value, onChange, onNavigate }) => {
  const handleChange = (_: any, newValue: number) => {
    onChange(newValue);
    onNavigate(navItems[newValue].path);
  };

  return (
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
  );
}; 