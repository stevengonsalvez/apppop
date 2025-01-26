import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { trackThemeChange } from '../utils/activity';

interface ThemeToggleProps {
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle }) => {
  const theme = useTheme();

  const handleToggle = async () => {
    const newTheme = theme.palette.mode === 'dark' ? 'light' : 'dark';
    onToggle();
    try {
      await trackThemeChange(newTheme);
    } catch (error) {
      console.error('Failed to track theme change:', error);
    }
  };

  return (
    <IconButton onClick={handleToggle} color="inherit">
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}; 