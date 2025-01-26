-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create type for billing period
DO $$ BEGIN
    CREATE TYPE billing_period AS ENUM ('monthly', 'yearly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create type for plan status
DO $$ BEGIN
    CREATE TYPE plan_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create type for subscription status
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  billing_period billing_period NOT NULL,
  features text[] DEFAULT '{}',
  status plan_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name, billing_period)
);

-- Create addons table
CREATE TABLE IF NOT EXISTS addons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  billing_period billing_period NOT NULL,
  category text NOT NULL,
  status plan_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name, billing_period)
);

-- Create plan_addons table for managing addon relationships
CREATE TABLE IF NOT EXISTS plan_addons (
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
  addon_id uuid REFERENCES addons(id) ON DELETE CASCADE,
  allowed boolean DEFAULT true,
  included boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (plan_id, addon_id)
);

-- Create user_plans table
CREATE TABLE IF NOT EXISTS user_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES plans(id),
  status subscription_status DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_addons table
CREATE TABLE IF NOT EXISTS user_addons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  addon_id uuid REFERENCES addons(id),
  status subscription_status DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, addon_id)
);

-- Updated timestamps triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON plans
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_addons_updated_at
    BEFORE UPDATE ON addons
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at
    BEFORE UPDATE ON user_plans
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_addons_updated_at
    BEFORE UPDATE ON user_addons
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Add RLS policies
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;

-- Plans and addons are readable by all authenticated users
CREATE POLICY "Plans are viewable by authenticated users"
  ON plans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Addons are viewable by authenticated users"
  ON addons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Plan addons are viewable by authenticated users"
  ON plan_addons FOR SELECT
  TO authenticated
  USING (true);

-- User plans policies
CREATE POLICY "Users can view their own plans"
  ON user_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans"
  ON user_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans"
  ON user_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User addons policies
CREATE POLICY "Users can view their own addons"
  ON user_addons FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own addons"
  ON user_addons FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addons"
  ON user_addons FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id); 