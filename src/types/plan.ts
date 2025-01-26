export type BillingPeriod = 'monthly' | 'yearly';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_period: BillingPeriod;
  features: string[];
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_period: BillingPeriod;
  category: string;
}

export interface PlanAddon {
  plan_id: string;
  addon_id: string;
  included: boolean;
  allowed: boolean;
}

export interface UserPlan {
  user_id: string;
  plan_id: string;
  billing_period: BillingPeriod;
  status: 'active' | 'cancelled' | 'pending';
  addons: { addon_id: string }[];
  created_at?: string;
  updated_at?: string;
} 