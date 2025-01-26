import { supabase } from './supabaseClient';

export enum ActivityType {
  VIDEO_WATCHED = 'video_watched',
  EVENT_RSVP = 'event_rsvp',
  PLAN_CHANGED = 'plan_changed',
  PROFILE_UPDATED = 'profile_updated',
  CHILD_ADDED = 'child_added',
  CHILD_UPDATED = 'child_updated',
  THEME_CHANGED = 'theme_changed',
  STORY_VIEWED = 'story_viewed',
  MEMBERSHIP_CHANGED = 'membership_changed'
}

interface ActivityMetadata {
  target_id?: string | null;
  target_type?: string;
  metadata: Record<string, any>;
}

// Helper functions for specific activity types
export const trackThemeChange = async (newTheme: 'light' | 'dark') => {
  return trackActivity(ActivityType.THEME_CHANGED, {
    metadata: { theme: newTheme }
  });
};

export const trackStoryView = async (storyId: string) => {
  return trackActivity(ActivityType.STORY_VIEWED, {
    target_id: storyId,
    target_type: 'story',
    metadata: {}
  });
};

export const trackMembershipChange = async (oldPlan: string, newPlan: string) => {
  return trackActivity(ActivityType.MEMBERSHIP_CHANGED, {
    metadata: {
      previous_plan: oldPlan,
      new_plan: newPlan
    }
  });
};

export const trackProfileUpdate = async (changes: Record<string, any>) => {
  return trackActivity(ActivityType.PROFILE_UPDATED, {
    metadata: { changes }
  });
};

export const trackActivity = async (
  activityType: ActivityType,
  data: ActivityMetadata
) => {
  try {
    const user = supabase.auth.user();
    if (!user) return;

    const { target_id, target_type, metadata = {} } = data;
    
    // Format the month as YYYY-MM to match partition format
    const now = new Date();
    const created_month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const isValidUUID = target_id?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    
    const payload = {
      user_id: user.id,
      activity_type: activityType,
      ...(isValidUUID ? { target_id } : {}),
      target_type,
      metadata,
      created_month
    };

    console.log('Activity payload:', payload);
    
    // Insert the activity (partitions are now managed automatically)
    const { data: result, error } = await supabase.from('activities').insert(payload);
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }

    return result;
  } catch (error) {
    console.error('Failed to track activity:', error);
    throw error;
  }
}; 