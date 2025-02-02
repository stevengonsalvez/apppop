import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../utils/supabaseClient';
import { ActivityType } from '../utils/activity';
import { 
  Video,
  Calendar,
  CreditCard,
  User,
  Users,
  Star
} from 'lucide-react';

const ACTIVITY_ICONS: Record<ActivityType, any> = {
  'video_watched': Video,
  'event_rsvp': Calendar,
  'plan_changed': CreditCard,
  'profile_updated': User,
  'child_added': Users,
  'child_updated': Users,
  'theme_changed': Star,
  'membership_changed': CreditCard
};

interface Activity {
  id: string;
  activity_type: ActivityType;
  metadata: Record<string, any>;
  created_at: string;
}

const TimelineEvent: React.FC<{activity: Activity}> = ({ activity }) => {
  const Icon = ACTIVITY_ICONS[activity.activity_type];

  const getActivityText = (activity: Activity): string => {
    switch (activity.activity_type) {
      case ActivityType.VIDEO_WATCHED:
        return `Watched video "${activity.metadata?.title || 'undefined'}"`;
      case ActivityType.EVENT_RSVP:
        return `RSVP'd ${activity.metadata?.status} to "${activity.metadata?.eventName}"`;
      case ActivityType.PLAN_CHANGED:
        return `Changed membership to ${activity.metadata?.planName || 'Basic'}`;
      case ActivityType.PROFILE_UPDATED:
        return 'Updated profile information';
      case ActivityType.CHILD_ADDED:
        return `Added ${activity.metadata?.childName} to family`;
      case ActivityType.CHILD_UPDATED:
        return `Updated ${activity.metadata?.childName}'s information`;
      case ActivityType.MEMBERSHIP_CHANGED:
        return `Changed membership to ${activity.metadata?.planName || 'Basic'}`;
      default:
        return 'Unknown activity';
    }
  };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineConnector sx={{ bgcolor: 'rgb(55, 65, 81)' }} />
        <TimelineDot 
          sx={{ 
            bgcolor: 'rgba(52, 58, 64, 0.8)', 
            borderColor: 'rgb(55, 65, 81)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0
          }}
        >
          <Icon size={16} color="rgb(52, 211, 153)" />
        </TimelineDot>
        <TimelineConnector sx={{ bgcolor: 'rgb(55, 65, 81)' }} />
      </TimelineSeparator>
      <TimelineContent sx={{ py: '12px', px: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(33, 37, 41, 0.8)',
              borderRadius: '12px',
              p: 2,
              backdropFilter: 'blur(8px)',
              width: '100%',
              maxWidth: '600px'
            }}
          >
            <Typography sx={{ color: 'white', mb: 1 }}>
              {getActivityText(activity)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgb(156, 163, 175)' }}>
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </Typography>
          </Box>
        </motion.div>
      </TimelineContent>
    </TimelineItem>
  );
};

const TimelineComponent: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setActivities(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography className="text-center text-red-500 py-8">
        {error}
      </Typography>
    );
  }

  if (activities.length === 0) {
    return (
      <Typography className="text-center text-gray-500 py-8">
        No activities yet
      </Typography>
    );
  }

  return (
    <Timeline position="left" sx={{ 
      p: 0,
      m: 0,
      [`& .MuiTimelineItem-root`]: {
        '&::before': {
          display: 'none'
        }
      }
    }}>
      {activities.map((activity) => (
        <TimelineEvent 
          key={activity.id} 
          activity={activity}
        />
      ))}
    </Timeline>
  );
};

export default TimelineComponent;