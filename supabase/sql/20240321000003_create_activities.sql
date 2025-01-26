-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";  -- Enable pg_cron for scheduled jobs

-- Create activity types enum
DO $$ BEGIN
    CREATE TYPE activity_type AS ENUM (
        'plan_changed',
        'video_watched',
        'event_rsvp',
        'profile_updated',
        'child_added',
        'child_updated'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create activities table with partitioning
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    activity_type activity_type NOT NULL,
    target_id UUID,  -- Optional reference to target object
    target_type TEXT, -- Type of target (video, event, etc.)
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_month TEXT NOT NULL, -- Store month as a regular column
    PRIMARY KEY (id, created_month) -- Include created_month in the primary key
) PARTITION BY RANGE (created_month);

-- Function to automatically create partitions for next 3 months
CREATE OR REPLACE FUNCTION create_future_partitions()
RETURNS void AS $$
DECLARE
    month_date DATE;
    partition_name TEXT;
    start_date TEXT;
    end_date TEXT;
BEGIN
    -- Create partitions for current month and next 2 months
    FOR i IN 0..2 LOOP
        month_date := date_trunc('month', now() + (i || ' month')::interval);
        partition_name := 'activities_y' || 
                         to_char(month_date, 'YYYY') ||
                         'm' || 
                         to_char(month_date, 'MM');
        start_date := to_char(month_date, 'YYYY-MM');
        end_date := to_char(month_date + interval '1 month', 'YYYY-MM');
        
        -- Create partition if it doesn't exist
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF activities FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            start_date,
            end_date
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create initial partitions
SELECT create_future_partitions();

-- Schedule automatic partition creation
SELECT cron.schedule(
    'create-activity-partitions',  -- job name
    '0 0 1 * *',  -- run at midnight on the 1st of every month
    $$SELECT create_future_partitions()$$
);

-- Create indexes
CREATE INDEX idx_activities_user_created ON activities(user_id, created_at DESC);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_target ON activities(target_id);
CREATE INDEX idx_activities_metadata ON activities USING gin (metadata);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own activities"
    ON activities FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert activities"
    ON activities FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Trigger to set created_month before insert
CREATE OR REPLACE FUNCTION set_created_month()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_month := to_char(NEW.created_at, 'YYYY-MM');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_set_created_month
BEFORE INSERT ON activities
FOR EACH ROW EXECUTE FUNCTION set_created_month(); 