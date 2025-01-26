import React, { useEffect, useRef, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import { useInfiniteQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../utils/supabaseClient';
import { ActivityType } from '../utils/activity';

const ACTIVITY_ICONS: Record<ActivityType, SvgIconComponent> = {
  [ActivityType.VIDEO_WATCHED]: OndemandVideoIcon,
  [ActivityType.EVENT_RSVP]: ConfirmationNumberIcon,
  [ActivityType.PLAN_CHANGED]: CreditCardIcon,
  [ActivityType.PROFILE_UPDATED]: PersonIcon,
  [ActivityType.CHILD_ADDED]: PeopleIcon,
  [ActivityType.CHILD_UPDATED]: PeopleIcon,
};

interface Activity {
  id: string;
  activity_type: ActivityType;
  metadata: Record<string, any>;
  created_at: string;
}

const getActivityText = (activity: Activity): string => {
  switch (activity.activity_type) {
    case ActivityType.VIDEO_WATCHED:
      return `Watched video "${activity.metadata?.title}"`;
    case ActivityType.EVENT_RSVP:
      return `RSVP'd ${activity.metadata?.status} to "${activity.metadata?.eventName}"`;
    case ActivityType.PLAN_CHANGED:
      return `Changed plan to ${activity.metadata?.planName}`;
    case ActivityType.PROFILE_UPDATED:
      return 'Updated profile information';
    case ActivityType.CHILD_ADDED:
      return `Added ${activity.metadata?.childName} to family`;
    case ActivityType.CHILD_UPDATED:
      return `Updated ${activity.metadata?.childName}'s information`;
    default:
      return 'Unknown activity';
  }
};

const Timeline: React.FC = () => {
  const loader = useRef<HTMLDivElement>(null);

  const fetchActivities = async ({ pageParam = undefined }) => {
    const user = supabase.auth.user();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (pageParam) {
      query = query.lt('created_at', pageParam);
    }

    const { data, error } = await query;
    if (error) throw error;

    const lastItem = data[data.length - 1];
    return {
      activities: data || [],
      nextCursor: lastItem?.created_at
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined
  });

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = loader.current;
    if (!element) return;

    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

  if (status === 'pending') {
    return (
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Typography className="text-center text-gray-500 py-8">
        Error loading activities
      </Typography>
    );
  }

  const activities = data?.pages.flatMap(page => page.activities) || [];
  
  if (activities.length === 0) {
    return (
      <Typography className="text-center text-gray-500 py-8">
        No activities yet
      </Typography>
    );
  }

  return (
    <Box className="px-4">
      {activities.map((activity: Activity, index) => {
        const IconComponent = ACTIVITY_ICONS[activity.activity_type] || PersonIcon;
        
        return (
          <Box 
            key={activity.id}
            className="relative flex gap-4 pb-8"
          >
            {/* Timeline line */}
            {index < activities.length - 1 && (
              <Box className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-700" />
            )}

            {/* Icon */}
            <Box className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-emerald-500">
              <IconComponent className="w-5 h-5" />
            </Box>

            {/* Content */}
            <Box className="flex-1 bg-gray-800 rounded-lg p-4">
              <Typography color="text.primary">
                {getActivityText(activity)}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mt-1">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
        );
      })}

      {/* Loading spinner */}
      <Box ref={loader} className="py-4 flex justify-center">
        {isFetchingNextPage && <CircularProgress />}
      </Box>
    </Box>
  );
};

export default Timeline; 