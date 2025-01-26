import React from 'react';
import { Container, Grid, Typography, Paper, Button, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Basket from '../components/Basket';
import { Plan, Addon } from '../types/plan';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface CheckoutPageProps {
  selectedPlan: Plan | null;
  selectedAddons: Addon[];
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ selectedPlan, selectedAddons }) => {
  const history = useHistory();

  const handlePayment = async () => {
    // TODO: Implement payment logic
    console.log('Processing payment...');
  };

  const handleBack = () => {
    history.push('/plans');
  };

  if (!selectedPlan) {
    history.push('/plans');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back to Plans
        </Button>
        <Typography variant="h4">
          Checkout
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Payment Section */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            
            {/* Placeholder for payment form */}
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Payment integration coming soon
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handlePayment}
                sx={{ mt: 2 }}
              >
                Complete Payment
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Basket
            plan={selectedPlan}
            addons={selectedAddons}
            showCheckoutButton={false}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage; 