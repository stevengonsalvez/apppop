import { supabase } from './supabaseClient';

export enum ActivityType {
  VIDEO_WATCHED = 'video_watched',
  EVENT_RSVP = 'event_rsvp',
  PLAN_CHANGED = 'plan_changed',
  PROFILE_UPDATED = 'profile_updated',
  CHILD_ADDED = 'child_added',
  CHILD_UPDATED = 'child_updated'
}

interface ActivityMetadata {
  target_id?: string | null;
  target_type?: string;
  metadata: Record<string, any>;
}

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