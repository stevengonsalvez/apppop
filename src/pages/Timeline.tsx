import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Timeline from '../components/Timeline';

const TimelinePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Activity Timeline
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          View your recent activities and interactions
        </Typography>
        <Timeline />
      </Box>
    </Container>
  );
};

export default TimelinePage; 