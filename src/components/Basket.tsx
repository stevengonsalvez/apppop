import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button
} from '@mui/material';
import { Plan, Addon } from '../types/plan';

interface BasketProps {
  plan: Plan | null;
  addons: Addon[];
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

const Basket: React.FC<BasketProps> = ({ 
  plan, 
  addons,
  onCheckout,
  showCheckoutButton = true
}) => {
  const calculateTotal = () => {
    let total = plan?.price || 0;
    addons.forEach(addon => {
      total += addon.price;
    });
    return total.toFixed(2);
  };

  if (!plan) return null;

  return (
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
        Order Summary
      </Typography>

      <List disablePadding>
        {/* Plan */}
        <ListItem sx={{ py: 2 }}>
          <ListItemText
            primary={plan.name}
            secondary={`${plan.billing_period} billing`}
          />
          <ListItemSecondaryAction>
            <Typography variant="body1">
              ${plan.price}/{plan.billing_period === 'monthly' ? 'mo' : 'yr'}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>

        {/* Addons */}
        {addons.length > 0 && (
          <>
            <Divider />
            {addons.map((addon) => (
              <ListItem key={addon.id} sx={{ py: 2 }}>
                <ListItemText
                  primary={addon.name}
                  secondary={`${addon.billing_period} billing`}
                />
                <ListItemSecondaryAction>
                  <Typography variant="body1">
                    ${addon.price}/{addon.billing_period === 'monthly' ? 'mo' : 'yr'}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </>
        )}

        {/* Total */}
        <Divider sx={{ my: 2 }} />
        <ListItem sx={{ py: 2 }}>
          <ListItemText
            primary={<Typography variant="h6">Total</Typography>}
            secondary={`per ${plan.billing_period}`}
          />
          <ListItemSecondaryAction>
            <Typography variant="h6">
              ${calculateTotal()}/{plan.billing_period === 'monthly' ? 'mo' : 'yr'}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      {showCheckoutButton && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={onCheckout}
          sx={{ mt: 3 }}
        >
          Proceed to Payment
        </Button>
      )}
    </Paper>
  );
};

export default Basket; 