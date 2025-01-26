import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';
import { UserPlan } from '../types/plan';
import { useUserContext } from '../contexts/UserContext';

export const useUserPlan = () => {
  const { user } = useUserContext();

  return useQuery<UserPlan>({
    queryKey: ['userPlan', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('user_plans')
        .select(`
          *,
          addons:user_addons(addon_id)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data as UserPlan;
    },
    enabled: !!user?.id
  });
}; 