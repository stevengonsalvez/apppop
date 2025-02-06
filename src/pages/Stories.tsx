import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  LinearProgress,
  styled,
  useTheme,
  alpha 
} from '@mui/material';
import { 
  Close as CloseIcon 
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

interface Story {
  id: string;
  title: string;
  content: string;
  image?: string;
  duration?: number; // in milliseconds
}

const mockStories: Story[] = [
  {
    id: '1',
    title: 'Pops for the day',
    content: 'Welcome to your daily app insights! Today we have some exciting features to share...',
    image: '/story-placeholder.jpg',
    duration: 5000,
  },
  {
    id: '2',
    title: 'New Features Alert',
    content: 'Check out our latest theme customization options and interactive elements!',
    duration: 5000,
  },
  {
    id: '3',
    title: 'Tips & Tricks',
    content: 'Did you know you can customize your profile with our new avatar options?',
    duration: 5000,
  }
];

const StoryContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.palette.mode === 'dark' ? '#000' : '#1a1a1a',
  display: 'flex',
  flexDirection: 'column',
  zIndex: theme.zIndex.modal,
}));

const StoryContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  padding: theme.spacing(2),
  textAlign: 'center',
  position: 'relative',
  cursor: 'pointer',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(0.5),
  zIndex: 1,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: '#fff',
  zIndex: 2,
}));

const StoriesPage: React.FC = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const history = useHistory();
  const _theme = useTheme();

  const currentStory = mockStories[currentStoryIndex];
  const storyDuration = currentStory?.duration || 5000;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + (100 / (storyDuration / 100));
        if (newProgress >= 100) {
          if (currentStoryIndex < mockStories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            return 0;
          } else {
            clearInterval(timer);
            history.push('/');
            return 100;
          }
        }
        return newProgress;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [currentStoryIndex, history, storyDuration]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = event;
    const { innerWidth } = window;
    const clickPosition = clientX / innerWidth;

    if (clickPosition > 0.5) {
      if (currentStoryIndex < mockStories.length - 1) {
        setCurrentStoryIndex(currentStoryIndex + 1);
        setProgress(0);
      } else {
        history.push('/');
      }
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleClose = () => {
    history.push('/');
  };

  return (
    <StoryContainer>
      <ProgressContainer>
        {mockStories.map((story, index) => (
          <Box key={story.id} sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={index === currentStoryIndex ? progress : index < currentStoryIndex ? 100 : 0}
              sx={{
                backgroundColor: alpha('#fff', 0.3),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#fff',
                },
              }}
            />
          </Box>
        ))}
      </ProgressContainer>

      <CloseButton onClick={handleClose}>
        <CloseIcon />
      </CloseButton>

      <StoryContent onClick={handleClick}>
        <Box sx={{ maxWidth: '600px', width: '100%' }}>
          <Box sx={{ fontSize: '24px', fontWeight: 'bold', mb: 2 }}>
            {currentStory.title}
          </Box>
          <Box sx={{ fontSize: '18px' }}>
            {currentStory.content}
          </Box>
        </Box>
      </StoryContent>
    </StoryContainer>
  );
};

export default StoriesPage; 