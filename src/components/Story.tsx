import React, { useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { trackStoryView } from '../utils/activity';

interface StoryProps {
  id: string;
  title: string;
  content: string;
  image?: string;
  onClose: () => void;
}

export const Story: React.FC<StoryProps> = ({ id, title, content, image, onClose }) => {
  useEffect(() => {
    const trackView = async () => {
      try {
        await trackStoryView(id);
      } catch (error) {
        console.error('Failed to track story view:', error);
      }
    };
    trackView();
  }, [id]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'background.paper',
        zIndex: (theme) => theme.zIndex.modal,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      {image && (
        <Box
          sx={{
            width: '100%',
            height: '60vh',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
        <Typography>{content}</Typography>
      </Box>
    </Box>
  );
}; 