import React, { useState, useMemo, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { usePlans } from '../hooks/usePlans';
import { useUserPlan } from '../hooks/useUserPlan';
import { BillingPeriod, Addon, Plan } from '../types/plan';
import { useUserContext } from '../contexts/UserContext';
import { useHistory } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

type TabValue = 'yourplan' | 'chooseplan' | 'addons';

const PlanCard: React.FC<{
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
  includedAddons: Addon[];
}> = ({ plan, isSelected, onSelect, includedAddons }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 2,
      border: '1px solid',
      borderColor: isSelected ? 'primary.main' : 'divider',
      borderRadius: 2,
      bgcolor: isSelected ? 'action.selected' : 'background.paper',
      cursor: 'pointer',
      '&:hover': {
        borderColor: 'primary.main',
      }
    }}
    onClick={onSelect}
  >
    <Typography variant="h5" gutterBottom color="primary">
      {plan.name}
    </Typography>
    <Typography variant="body1" color="text.secondary" gutterBottom>
      {plan.description}
    </Typography>
    <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
      ${plan.price}/{plan.billing_period === 'monthly' ? 'mo' : 'yr'}
    </Typography>
    
    <Divider sx={{ my: 2 }} />
    
    <List disablePadding>
      {plan.features.map((feature, index) => (
        <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
          <CheckCircleIcon sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
          <ListItemText primary={feature} />
        </ListItem>
      ))}
    </List>

    {includedAddons.length > 0 && (
      <>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" gutterBottom>
          Included Add-ons:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {includedAddons.map((addon) => (
            <Chip
              key={addon.id}
              label={addon.name}
              size="small"
              color="success"
            />
          ))}
        </Box>
      </>
    )}
  </Paper>
);

const AddonCard: React.FC<{
  addon: Addon;
  isSelected: boolean;
  onSelect: () => void;
  isIncluded?: boolean;
}> = ({ addon, isSelected, onSelect, isIncluded }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 2,
      border: '1px solid',
      borderColor: isSelected ? 'primary.main' : 'divider',
      borderRadius: 2,
      bgcolor: isSelected ? 'action.selected' : 'background.paper',
      cursor: isIncluded ? 'default' : 'pointer',
      opacity: isIncluded ? 0.7 : 1,
      '&:hover': {
        borderColor: isIncluded ? 'divider' : 'primary.main',
      }
    }}
    onClick={!isIncluded ? onSelect : undefined}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          {addon.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {addon.description}
        </Typography>
      </Box>
      <Typography variant="h6" color="text.primary">
        ${addon.price}/{addon.billing_period === 'monthly' ? 'mo' : 'yr'}
      </Typography>
    </Box>
    {isIncluded && (
      <Chip label="Included with your plan" color="success" size="small" />
    )}
  </Paper>
);

const Plans: React.FC = () => {
  const { data: planData } = usePlans();
  const { data: userPlan, isLoading: _isUserPlanLoading } = useUserPlan();
  const { user: _user } = useUserContext();
  const history = useHistory();
  
  const [activeTab, setActiveTab] = useState<TabValue>('yourplan');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  
  const [currentPlan, setCurrentPlan] = useState<string | null>(
    userPlan?.plan_id || null
  );
  const [currentAddons, setCurrentAddons] = useState<Set<string>>(
    new Set(userPlan?.addons.map(a => a.addon_id) || [])
  );
  
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(
    userPlan?.billing_period || 'monthly'
  );

  useEffect(() => {
    if (userPlan) {
      setCurrentPlan(userPlan.plan_id);
      setBillingPeriod(userPlan.billing_period);
      setCurrentAddons(new Set(userPlan.addons.map(a => a.addon_id)));
      setSelectedPlan(userPlan.plan_id);
      setSelectedAddons(new Set(userPlan.addons.map(a => a.addon_id)));
    }
  }, [userPlan]);

  const {
    filteredPlans,
    filteredAddons,
    includedAddonsByPlan,
  } = useMemo(() => {
    if (!planData) {
      return {
        filteredPlans: [],
        filteredAddons: [],
        includedAddonsByPlan: new Map(),
      };
    }

    const { plans, addons, planAddons } = planData;

    const filteredPlans = plans.filter(m => m.billing_period === billingPeriod);
    const filteredAddons = addons.filter(a => a.billing_period === billingPeriod);

    const includedAddonsByPlan = new Map();

    filteredPlans.forEach(plan => {
      const included = filteredAddons.filter(addon =>
        planAddons.some(pa =>
          pa.plan_id === plan.id &&
          pa.addon_id === addon.id &&
          pa.included
        )
      );
      includedAddonsByPlan.set(plan.id, included);
    });

    return {
      filteredPlans,
      filteredAddons,
      includedAddonsByPlan,
    };
  }, [planData, billingPeriod]);

  const currentPlanDetails = useMemo(() => {
    if (!currentPlan || !planData) return null;
    return planData.plans.find(p => p.id === currentPlan);
  }, [currentPlan, planData]);

  const currentAddonsDetails = useMemo(() => {
    if (!planData) return [];
    return Array.from(currentAddons).map(addonId => 
      planData.addons.find(a => a.id === addonId)
    ).filter(Boolean);
  }, [currentAddons, planData]);

  const selectedPlanDetails = useMemo(() => {
    if (!selectedPlan || !planData) return null;
    return planData.plans.find(p => p.id === selectedPlan);
  }, [selectedPlan, planData]);

  const selectedAddonsDetails = useMemo(() => {
    if (!planData) return [];
    return Array.from(selectedAddons).map(addonId => 
      planData.addons.find(a => a.id === addonId)
    ).filter(Boolean) as Addon[];
  }, [selectedAddons, planData]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  const handleCheckout = () => {
    history.push('/checkout', {
      selectedPlan: selectedPlanDetails,
      selectedAddons: selectedAddonsDetails
    });
  };

  const handleClearBasket = () => {
    setSelectedPlan(currentPlan);
    setSelectedAddons(new Set(currentAddons));
    setActiveTab('yourplan');
  };

  const renderYourPlan = () => (
    <Grid container spacing={3}>
      {/* Current Plan Widget */}
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            height: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="medium">
            Your Current Plan
          </Typography>
          
          {currentPlanDetails ? (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {currentPlanDetails.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {currentPlanDetails.description}
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                  ${currentPlanDetails.price}/{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Features
              </Typography>
              <List disablePadding>
                {currentPlanDetails.features.map((feature, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 1 }}>
                    <CheckCircleIcon sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>

              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                sx={{ mt: 3 }}
                onClick={() => setActiveTab('chooseplan')}
              >
                Change Plan
              </Button>
            </Box>
          ) : (
            <Typography color="text.secondary">No active plan</Typography>
          )}
        </Paper>
      </Grid>

      {/* Add-ons Widget */}
      <Grid item xs={12} md={6}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3,
            height: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="medium">
            Your Add-ons
          </Typography>

          {/* Active Add-ons */}
          {currentAddonsDetails.length > 0 ? (
            <Box>
              <List disablePadding>
                {currentAddonsDetails.map((addon) => addon && (
                  <ListItem 
                    key={addon.id}
                    sx={{
                      py: 2,
                      px: 2,
                      mb: 1,
                      bgcolor: 'action.hover',
                      borderRadius: 1
                    }}
                  >
                    <ListItemText 
                      primary={addon.name}
                      secondary={addon.description}
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2" color="text.secondary">
                        ${addon.price}/{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              No active add-ons
            </Typography>
          )}

          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setActiveTab('addons')}
          >
            Browse Add-ons
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderChoosePlan = () => (
    <Box>
      {filteredPlans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedPlan === plan.id}
          onSelect={() => {
            setSelectedPlan(plan.id);
            setActiveTab('addons');
          }}
          includedAddons={includedAddonsByPlan.get(plan.id) || []}
        />
      ))}
    </Box>
  );

  const renderAddons = () => (
    <Box>
      {selectedPlan && filteredAddons.map((addon) => {
        const isIncluded = includedAddonsByPlan.get(selectedPlan)?.some((a: Addon) => a.id === addon.id);
        return (
          <AddonCard
            key={addon.id}
            addon={addon}
            isSelected={selectedAddons.has(addon.id)}
            onSelect={() => {
              setSelectedAddons(prev => {
                const newSet = new Set(prev);
                if (newSet.has(addon.id)) {
                  newSet.delete(addon.id);
                } else {
                  newSet.add(addon.id);
                }
                return newSet;
              });
            }}
            isIncluded={isIncluded}
          />
        );
      })}
      {!selectedPlan && (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
          Please select a plan first
        </Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        mb: 4
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          centered
          sx={{ 
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 'medium',
              minWidth: { xs: 'auto', sm: 160 },
              px: { xs: 2, sm: 3 },
            },
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center'
            }
          }}
        >
          <Tab label="Your Plan" value="yourplan" />
          <Tab label="Choose Plan" value="chooseplan" />
          <Tab label="Add-ons" value="addons" />
        </Tabs>
      </Box>

      {activeTab === 'yourplan' && renderYourPlan()}
      {activeTab === 'chooseplan' && renderChoosePlan()}
      {activeTab === 'addons' && renderAddons()}

      {/* Review Order Button */}
      {selectedPlanDetails && (activeTab === 'chooseplan' || activeTab === 'addons') && (
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 1000
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: 'md',
              mx: 'auto'
            }}>
              <Box>
                <Typography variant="h6" color="text.primary">
                  ${selectedPlanDetails.price + selectedAddonsDetails.reduce((sum, addon) => sum + addon.price, 0)}
                  /{selectedPlanDetails.billing_period === 'monthly' ? 'mo' : 'yr'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedAddonsDetails.length} add-ons selected
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={handleClearBasket}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleCheckout}
                >
                  Review Order
                </Button>
              </Box>
            </Box>
          </Container>
        </Paper>
      )}
    </Container>
  );
};

export default Plans; 