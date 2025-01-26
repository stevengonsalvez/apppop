import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { trackMembershipChange } from '../utils/activity';
import { supabase } from '../utils/supabaseClient';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface SubscriptionProps {
  currentPlan: string;
  availablePlans: Plan[];
}

export const Subscription: React.FC<SubscriptionProps> = ({ currentPlan, availablePlans }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlanChange = async (newPlan: Plan) => {
    setLoading(true);
    setError(null);

    try {
      // Here you would typically integrate with your payment provider (e.g., Stripe)
      // For this example, we'll just update the user's plan in Supabase
      const user = supabase.auth.user();
      if (!user) throw new Error('No user found');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_plan: newPlan.id })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Track the plan change
      await trackMembershipChange(currentPlan, newPlan.name);

    } catch (err) {
      console.error('Error changing plan:', err);
      setError('Failed to change plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
      {availablePlans.map((plan) => (
        <Card 
          key={plan.id}
          sx={{ 
            position: 'relative',
            transform: plan.name === currentPlan ? 'scale(1.05)' : 'none',
            boxShadow: (theme) => plan.name === currentPlan ? theme.shadows[10] : theme.shadows[1],
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {plan.name}
            </Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>
              ${plan.price}
            </Typography>
            <Box sx={{ mb: 2 }}>
              {plan.features.map((feature, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  • {feature}
                </Typography>
              ))}
            </Box>
            <Button
              fullWidth
              variant={plan.name === currentPlan ? 'outlined' : 'contained'}
              disabled={loading || plan.name === currentPlan}
              onClick={() => handlePlanChange(plan)}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : plan.name === currentPlan ? (
                'Current Plan'
              ) : (
                'Switch Plan'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}; 