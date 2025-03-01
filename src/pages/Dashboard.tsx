import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Chip, Avatar, Grid } from '@mui/material';
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

interface BaseCard {
  type: string;
  title: string;
  level: string;
  color: string;
  icon: React.ReactNode;
  users?: number;
  image?: string;
  size: 'small' | 'medium' | 'large';
}

interface FeatureCard extends BaseCard {
  type: 'feature';
  progress?: number;
}

interface DocumentationCard extends BaseCard {
  type: 'documentation';
  docTitle: string;
  markdownPath: string;
  progress?: number;
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
    markdownPath: '/docs/theme-system',
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
    markdownPath: '/docs/components',
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
    markdownPath: '/docs/auth',
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
    markdownPath: '/docs/development',
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
    markdownPath: '/docs/profile',
    size: 'small'
  },
  {
    type: 'documentation',
    title: 'API Integration',
    docTitle: 'API Documentation',
    level: 'Advanced',
    color: '#EC407A',
    icon: <BikeIcon />,
    users: 5,
    image: '/apppop_sample6.jpg',
    markdownPath: '/docs/api',
    size: 'large'
  },
];

const CardComponent: React.FC<{ item: FeatureCard | DocumentationCard; index: number }> = ({ item, index }) => {
  const theme = useTheme();
  const history = useHistory();

  const handleClick = () => {
    if (item.type === 'documentation') {
      history.push(`/app${item.markdownPath}`);
    }
  };

  const getCardSize = () => {
    switch (item.size) {
      case 'small':
        return { xs: 12, sm: 6, md: 4 };
      case 'medium':
        return { xs: 12, sm: 6, md: 6 };
      case 'large':
        return { xs: 12, sm: 12, md: 8 };
      default:
        return { xs: 12, sm: 6, md: 4 };
    }
  };

  return (
    <Grid item {...getCardSize()}>
      <MotionBox
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: index * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }
        }}
        whileHover={{ 
          y: -10,
          boxShadow: theme.shadows[10],
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.98 }}
        sx={{
          position: 'relative',
          height: item.size === 'small' ? 200 : item.size === 'medium' ? 240 : 280,
          borderRadius: 4,
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundImage: `url(${item.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: theme.shadows[4],
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to bottom, ${alpha(item.color, 0.2)} 0%, ${alpha(item.color, 0.8)} 100%)`,
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <MotionChip
              icon={React.isValidElement(item.icon) ? item.icon : undefined}
              label={item.level}
              size="small"
              sx={{
                bgcolor: alpha('#fff', 0.2),
                color: '#fff',
                backdropFilter: 'blur(4px)',
                fontWeight: 'bold',
                '& .MuiChip-icon': {
                  color: '#fff',
                },
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: { 
                  delay: index * 0.1 + 0.2,
                  duration: 0.5
                }
              }}
            />
            {item.users && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: alpha('#fff', 0.2),
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                {item.users}
              </Avatar>
            )}
          </Box>
          <Box>
            <Typography
              variant="h5"
              component={motion.h2}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: index * 0.1 + 0.3,
                  duration: 0.5
                }
              }}
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body2"
              component={motion.p}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: index * 0.1 + 0.4,
                  duration: 0.5
                }
              }}
              sx={{
                color: alpha('#fff', 0.9),
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              {item.type === 'documentation' ? item.docTitle : 'Feature card'}
            </Typography>
          </Box>
        </Box>
      </MotionBox>
    </Grid>
  );
};

const DashboardPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography 
        variant="h4" 
        component={motion.h1}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          color: theme.palette.text.primary
        }}
      >
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {features.map((item, index) => (
          <CardComponent key={item.title} item={item} index={index} />
        ))}
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <SentryTest />
      </Box>
    </Box>
  );
};

export default DashboardPage; 