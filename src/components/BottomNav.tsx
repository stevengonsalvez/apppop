import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon, Person as PersonIcon } from '@mui/icons-material';

interface BottomNavProps {
  value: number;
  onChange: (newValue: number) => void;
  onNavigate: (path: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  value,
  onChange,
  onNavigate,
}) => {
  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        display: { xs: 'block', sm: 'none' }
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        showLabels
      >
        <BottomNavigationAction 
          label="Home" 
          icon={<HomeIcon />} 
          onClick={() => onNavigate('/home')}
        />
        <BottomNavigationAction 
          label="Search" 
          icon={<SearchIcon />} 
          onClick={() => onNavigate('/search')}
        />
        <BottomNavigationAction 
          label="Profile" 
          icon={<PersonIcon />} 
          onClick={() => onNavigate('/profile')}
        />
      </BottomNavigation>
    </Paper>
  );
}; 