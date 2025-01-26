import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';
import { Plan, Addon, PlanAddon } from '../types/plan';

interface PlansData {
  plans: Plan[];
  addons: Addon[];
  planAddons: PlanAddon[];
}

export const usePlans = () => {
  return useQuery<PlansData>({
    queryKey: ['plans'],
    queryFn: async () => {
      const [plansResult, addonsResult, planAddonsResult] = await Promise.all([
        supabase.from('plans').select('*'),
        supabase.from('addons').select('*'),
        supabase.from('plan_addons').select('*')
      ]);

      if (plansResult.error) throw plansResult.error;
      if (addonsResult.error) throw addonsResult.error;
      if (planAddonsResult.error) throw planAddonsResult.error;

      return {
        plans: plansResult.data as Plan[],
        addons: addonsResult.data as Addon[],
        planAddons: planAddonsResult.data as PlanAddon[]
      };
    }
  });
}; 