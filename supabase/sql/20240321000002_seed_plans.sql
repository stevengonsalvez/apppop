-- Insert sample plans
INSERT INTO plans (name, description, price, billing_period, features, status) VALUES
  ('Basic', 'Perfect for getting started', 9.99, 'monthly', ARRAY[
    'Up to 5 projects',
    'Basic analytics',
    'Email support'
  ], 'active'),
  ('Premium', 'Most popular for growing teams', 29.99, 'monthly', ARRAY[
    'Unlimited projects',
    'Advanced analytics',
    'Priority support',
    'Team collaboration',
    'Custom branding'
  ], 'active'),
  ('Enterprise', 'For large organizations', 99.99, 'monthly', ARRAY[
    'Everything in Premium',
    'Dedicated support',
    'SLA guarantee',
    'Custom integrations',
    'Advanced security'
  ], 'active'),
  ('Basic', 'Perfect for getting started', 99.99, 'yearly', ARRAY[
    'Up to 5 projects',
    'Basic analytics',
    'Email support'
  ], 'active'),
  ('Premium', 'Most popular for growing teams', 299.99, 'yearly', ARRAY[
    'Unlimited projects',
    'Advanced analytics',
    'Priority support',
    'Team collaboration',
    'Custom branding'
  ], 'active'),
  ('Enterprise', 'For large organizations', 999.99, 'yearly', ARRAY[
    'Everything in Premium',
    'Dedicated support',
    'SLA guarantee',
    'Custom integrations',
    'Advanced security'
  ], 'active');

-- Insert sample addons
INSERT INTO addons (name, description, price, billing_period, category, status) VALUES
  ('Additional Storage', '50GB extra storage space', 4.99, 'monthly', 'storage', 'active'),
  ('API Access', 'Access to our REST API', 9.99, 'monthly', 'api', 'active'),
  ('Premium Support', '24/7 phone and email support', 19.99, 'monthly', 'support', 'active'),
  ('White Label', 'Remove our branding', 29.99, 'monthly', 'branding', 'active'),
  ('Additional Storage', '50GB extra storage space', 49.99, 'yearly', 'storage', 'active'),
  ('API Access', 'Access to our REST API', 99.99, 'yearly', 'api', 'active'),
  ('Premium Support', '24/7 phone and email support', 199.99, 'yearly', 'support', 'active'),
  ('White Label', 'Remove our branding', 299.99, 'yearly', 'branding', 'active');

-- Set up plan-addon relationships
WITH plans_cte AS (
  SELECT id, name, billing_period FROM plans WHERE status = 'active'
),
addons_cte AS (
  SELECT id, name, billing_period FROM addons WHERE status = 'active'
)
INSERT INTO plan_addons (plan_id, addon_id, included, allowed)
SELECT 
  p.id,
  a.id,
  CASE 
    WHEN p.name = 'Enterprise' AND a.name IN ('API Access', 'Premium Support') THEN true
    WHEN p.name = 'Premium' AND a.name = 'API Access' THEN true
    ELSE false
  END as included,
  CASE 
    WHEN p.name = 'Basic' AND a.name IN ('White Label') THEN false
    ELSE true
  END as allowed
FROM plans_cte p
CROSS JOIN addons_cte a
WHERE p.billing_period = a.billing_period; 