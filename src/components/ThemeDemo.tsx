import React from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ColorBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ThemeDemo: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Theme Colors Demo</Typography>
      
      <Grid container spacing={3}>
        {/* Primary Colors */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Primary Colors</Typography>
            <ColorBox sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
              Primary Main
            </ColorBox>
            <ColorBox sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}>
              Primary Light
            </ColorBox>
            <ColorBox sx={{ bgcolor: theme.palette.primary.dark, color: theme.palette.primary.contrastText }}>
              Primary Dark
            </ColorBox>
          </Card>
        </Grid>

        {/* Secondary Colors */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Secondary Colors</Typography>
            <ColorBox sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>
              Secondary Main
            </ColorBox>
            <ColorBox sx={{ bgcolor: theme.palette.secondary.light, color: theme.palette.secondary.contrastText }}>
              Secondary Light
            </ColorBox>
            <ColorBox sx={{ bgcolor: theme.palette.secondary.dark, color: theme.palette.secondary.contrastText }}>
              Secondary Dark
            </ColorBox>
          </Card>
        </Grid>

        {/* Tertiary Colors */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Tertiary Colors</Typography>
            <ColorBox sx={{ bgcolor: 'var(--tertiary-main)', color: 'var(--tertiary-contrast-text)' }}>
              Tertiary Main
            </ColorBox>
            <ColorBox sx={{ bgcolor: 'var(--tertiary-light)', color: 'var(--tertiary-contrast-text)' }}>
              Tertiary Light
            </ColorBox>
            <ColorBox sx={{ bgcolor: 'var(--tertiary-dark)', color: 'var(--tertiary-contrast-text)' }}>
              Tertiary Dark
            </ColorBox>
          </Card>
        </Grid>

        {/* Surface Colors */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Surface Colors</Typography>
            <Paper sx={{ p: 2, mb: 1 }}>Default Paper</Paper>
            <Paper data-surface="true" sx={{ p: 2, mb: 1 }}>Surface</Paper>
            <Paper data-surface-variant="true" sx={{ p: 2 }}>Surface Variant</Paper>
          </Card>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Buttons</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant="contained" color="primary">Primary</Button>
              <Button variant="contained" color="secondary">Secondary</Button>
              <Button variant="contained" color="tertiary">Tertiary</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="primary">Primary</Button>
              <Button variant="outlined" color="secondary">Secondary</Button>
              <Button variant="outlined" color="tertiary">Tertiary</Button>
            </Box>
          </Card>
        </Grid>

        {/* State Colors */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>State Colors</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" color="error">Error</Button>
              <Button variant="contained" color="warning">Warning</Button>
              <Button variant="contained" color="info">Info</Button>
              <Button variant="contained" color="success">Success</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThemeDemo; 