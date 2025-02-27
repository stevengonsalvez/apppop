import React, { useState } from 'react';
import { 
  Box, 
  Menu, 
  MenuItem, 
  styled,
  Fade,
  useTheme,
  alpha,
  keyframes
} from '@mui/material';
import { 
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

interface InteractiveLogoProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const morphAndGlow = keyframes`
  0% {
    transform: scale(0.6);
    color: #f06292;
    filter: drop-shadow(0 0 2px rgba(240, 98, 146, 0.3));
  }
  50% {
    transform: scale(1.4);
    color: #ec407a;
    filter: drop-shadow(0 0 8px rgba(236, 64, 122, 0.6));
  }
  100% {
    transform: scale(0.6);
    color: #f06292;
    filter: drop-shadow(0 0 2px rgba(240, 98, 146, 0.3));
  }
`;

const logoGlow = keyframes`
  0% {
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.2));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(144, 202, 249, 0.8));
    transform: scale(1.03);
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.2));
    transform: scale(1);
  }
`;

const StyledLogoWrapper = styled('div')(({ theme }) => ({
  marginLeft: 'auto',
  cursor: 'pointer',
  transition: theme.transitions.create(['transform', 'filter'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'scale(1.05)',
    filter: `drop-shadow(0 0 8px ${alpha(theme.palette.primary.main, 0.5)})`,
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 20,
    marginRight: 32,
    minWidth: 'auto',
    background: 'transparent',
    boxShadow: 'none',
    '& .MuiMenu-list': {
      padding: '4px',
      display: 'flex',
      flexDirection: 'row',
      gap: '8px',
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(0.75),
  minWidth: 'auto',
  minHeight: 'auto',
  display: 'flex',
  justifyContent: 'center',
  transition: 'all 0.2s',
  background: 'transparent',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.08),
  },
  '& .MuiSvgIcon-root': {
    fontSize: 24,
    transition: 'transform 0.3s',
  },
  '&:hover .MuiSvgIcon-root:not(.morph)': {
    transform: 'rotate(360deg)',
  },
  '& .morph': {
    animation: `${morphAndGlow} 1.5s infinite ease-in-out`,
  },
}));

const StyledStarIcon = styled(StarIcon)(({ theme }) => ({
  '&.morph': {
    animation: `${morphAndGlow} 1.5s infinite ease-in-out`,
    fontSize: 28,
  }
}));

export const InteractiveLogo: React.FC<InteractiveLogoProps> = ({ 
  onThemeToggle,
  isDarkMode 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeToggle = () => {
    onThemeToggle();
    handleClose();
  };

  const handleStoryClick = () => {
    handleClose();
    history.push('/stories');
  };

  return (
    <>
      <StyledLogoWrapper onClick={handleClick}>
        <Box
          component="img"
          src="/logo.png"
          alt="App Logo"
          sx={{
            height: { xs: 45, sm: 45 },
            width: 'auto',
            objectFit: 'contain',
            borderRadius: 2,
            display: 'block',
            animation: `${logoGlow} 3s infinite ease-in-out`,
            transition: 'all 0.3s ease',
            filter: `drop-shadow(0 0 4px ${isDarkMode ? 
              alpha(theme.palette.primary.light, 0.4) : 
              alpha(theme.palette.primary.main, 0.4)})`,
            '&:hover': {
              animation: 'none',
              filter: `drop-shadow(0 0 12px ${isDarkMode ? 
                theme.palette.primary.light : 
                theme.palette.primary.main})`,
              transform: 'scale(1.05)',
            }
          }}
        />
      </StyledLogoWrapper>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <StyledMenuItem onClick={handleThemeToggle}>
          {isDarkMode ? (
            <LightModeIcon 
              sx={{ 
                color: theme.palette.warning.main,
              }} 
            />
          ) : (
            <DarkModeIcon 
              sx={{ 
                color: theme.palette.primary.main,
              }} 
            />
          )}
        </StyledMenuItem>
        <StyledMenuItem onClick={handleStoryClick}>
          <StyledStarIcon className="morph" />
        </StyledMenuItem>
      </StyledMenu>
    </>
  );
}; 