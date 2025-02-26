import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Chip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import {
  FitnessCenter as FitnessCenterIcon,
  DirectionsRun as RunIcon,
  SelfImprovement as YogaIcon,
  DirectionsBike as BikeIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { SentryTest } from '../components/SentryTest';
import { DocWidget } from '../components/DocWidget';
import { useHistory } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionChip = motion(Chip);

interface FeatureCard {
  type: string;
  title: string;
  level: string;
  progress?: number;
  color: string;
  icon: React.ReactNode;
  users?: number;
  image?: string;
  size: 'small' | 'medium' | 'large';
}

interface DocumentationCard {
  type: 'documentation';
  title: string;
  docTitle: string;
  markdownPath: string;
  level: string;
  color: string;
  icon: React.ReactNode;
  users?: number;
  image?: string;
  size: 'small' | 'medium' | 'large';
}

export const features: (FeatureCard | DocumentationCard)[] = [
  {
    type: 'documentation',
    title: 'Theme System',
    docTitle: 'Theme System Documentation',
    level: 'Customizable',
    color: '#7C4DFF',
    icon: <FitnessCenterIcon />,
    users: 3,
    image: '/apppop_sample1.jpg',
    markdownPath: '/docs/theme-system.md',
    size: 'medium'
  },
  {
    type: 'documentation',
    title: 'Components',
    docTitle: 'Component Library Documentation',
    level: 'Interactive',
    color: '#FF4081',
    icon: <YogaIcon />,
    users: 2,
    image: '/apppop_sample2.jpg',
    markdownPath: '/docs/components.md',
    size: 'large'
  },
  {
    type: 'documentation',
    title: 'Authentication',
    docTitle: 'Authentication Guide',
    level: 'Implemented',
    progress: 100,
    color: '#00BFA5',
    icon: <BikeIcon />,
    users: 4,
    image: '/apppop_sample3.jpg',
    markdownPath: '/docs/auth.md',
    size: 'small'
  },
  {
    type: 'documentation',
    title: 'Development Guide',
    docTitle: 'Development Documentation',
    level: 'Responsive',
    color: '#FFA726',
    icon: <RunIcon />,
    users: 2,
    image: '/apppop_sample4.jpg',
    markdownPath: '/docs/development.md',
    size: 'medium'
  },
  {
    type: 'documentation',
    title: 'User Profile',
    docTitle: 'Profile System Documentation',
    level: 'Customizable',
    color: '#26C6DA',
    icon: <YogaIcon />,
    users: 3,
    image: '/apppop_sample5.jpg',
    markdownPath: '/docs/profile.md',
    size: 'small'
  },
  {
    type: 'documentation',
    title: 'Analytics & Tracking',
    docTitle: 'Analytics Setup Guide',
    level: 'Stripe Ready',
    progress: 90,
    color: '#66BB6A',
    icon: <BikeIcon />,
    users: 1,
    image: '/apppop_sample6.jpg',
    markdownPath: '/docs/GoogleAnalytics.md',
    size: 'medium'
  },
  {
    type: 'documentation',
    title: 'Theme Modes',
    docTitle: 'Theme System - Dark Mode',
    level: 'Built-in',
    color: '#9575CD',
    icon: <RunIcon />,
    users: 5,
    image: '/apppop_sample7.jpg',
    markdownPath: '/docs/theme-system.md',
    size: 'small'
  },
  {
    type: 'documentation',
    title: 'Monitoring',
    docTitle: 'Monitoring & Performance',
    level: 'Real-time',
    progress: 85,
    color: '#F06292',
    icon: <FitnessCenterIcon />,
    users: 2,
    image: '/apppop_sample8.jpg',
    markdownPath: '/docs/monitoring.md',
    size: 'large'
  }
];

const categories = ['All', 'Core', 'UI/UX', 'Integrations', 'Analytics'];

const CardComponent: React.FC<{ item: FeatureCard | DocumentationCard; index: number }> = ({ item, index }) => {
  const history = useHistory();
  const _theme = useTheme();
  
  const handleClick = () => {
    if (item.type === 'documentation') {
      const docPath = item.markdownPath.replace('/docs/', '').replace('.md', '');
      history.push(`/docs/${docPath}`);
    }
  };

  const sizeStyles = {
    small: {
      gridRow: 'span 1',
      gridColumn: 'span 1',
      height: 200,
    },
    medium: {
      gridRow: 'span 2',
      gridColumn: 'span 1',
      height: 300,
    },
    large: {
      gridRow: 'span 2',
      gridColumn: {
        xs: 'span 2',
        sm: 'span 2',
        md: 'span 2'
      },
      height: 300,
    },
  }[item.size];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MotionBox
        onClick={handleClick}
        initial={{ 
          opacity: 0,
          rotateX: 75,
          y: -200,
          z: -100
        }}
        animate={{ 
          opacity: 1,
          rotateX: 0,
          y: 0,
          z: 0
        }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: index * 0.1 
        }}
        whileHover={{ 
          rotateX: 0,
          rotateZ: 0,
          scale: 1.02,
          transition: { duration: 0.6 }
        }}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundImage: item.image ? `url(${item.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transformStyle: 'preserve-3d',
          perspective: '900px',
          boxShadow: '0px 20px 60px rgba(0,0,0, 0.5)',
          '&:hover': {
            boxShadow: '0px 0px 20px rgba(0,0,0, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(item.color, 0.8)}, ${alpha(item.color, 0.4)})`,
            zIndex: 1,
          },
          ...sizeStyles,
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', bgcolor: alpha(_theme.palette.background.paper, 0.8), px: 1, py: 0.5, borderRadius: 1, fontSize: '0.7rem' }}>
              {item.type === 'documentation' ? 'Documentation' : item.type}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)', fontSize: '1.4rem' }}>
                {item.title}
              </Typography>
              {item.users && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: item.color }}>
                    {item.users}
                  </Avatar>
                </Box>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white',
                bgcolor: alpha(_theme.palette.background.paper, 0.3),
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backdropFilter: 'blur(4px)',
                fontSize: '0.7rem'
              }}
            >
              {item.level}
            </Typography>
            {'progress' in item && item.progress && (
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  border: `3px solid ${item.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(_theme.palette.background.paper, 0.3),
                  backdropFilter: 'blur(4px)'
                }}
              >
                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {item.progress}%
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </MotionBox>

      {item.type === 'documentation' && (
        <DocWidget
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={item.docTitle}
          markdownContent={item.markdownPath}
          color={item.color}
        />
      )}
    </>
  );
};

export const HomePage: React.FC = () => {
  const _theme = useTheme();

  return (
    <Box sx={{ 
      p: 3, 
      pb: { xs: 8, sm: 3 },
      bgcolor: 'background.default', 
      minHeight: '100vh',
      position: 'relative',
      zIndex: 0,
      perspective: '900px',
      transformStyle: 'preserve-3d'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
        <Box sx={{ maxWidth: '800px' }}>
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900,
                fontSize: { xs: '1.75rem', sm: '2.45rem', md: '2.8rem' },
                lineHeight: 1.2,
                mb: 2,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to left, #FF6B6B 60%, #4ECDC4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Build your App
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900,
                fontSize: { xs: '1.75rem', sm: '2.45rem', md: '2.8rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: 'text.primary'
              }}
            >
              with{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(to left, #FF6B6B 60%, #4ECDC4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AppPoP
              </Box>
            </Typography>
          </MotionBox>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <MotionBox
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <NotificationsIcon />
          </MotionBox>
          <MotionBox
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <SettingsIcon />
          </MotionBox>
          <MotionBox
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <SentryTest />
          </MotionBox>
        </Box>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {categories.map((category, index) => (
          <MotionChip
            key={category}
            label={category}
            clickable
            variant={index === 0 ? 'filled' : 'outlined'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            sx={{
              borderRadius: 3,
              bgcolor: index === 0 ? 'primary.main' : 'transparent',
              '&:hover': {
                bgcolor: index === 0 ? 'primary.dark' : 'action.hover',
              },
              px: 2,
              height: 36,
              borderWidth: 2,
              fontWeight: 'bold'
            }}
          />
        ))}
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: { xs: 2, sm: 3 },
        gridAutoFlow: 'dense',
        pb: { xs: 8, sm: 3 },
      }}>
        {features.map((item, index) => (
          <CardComponent key={item.title} item={item} index={index} />
        ))}
      </Box>
    </Box>
  );
}; 