-- Create the profiles table with proper constraints
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  date_of_birth date,
  marketing_email boolean DEFAULT false,
  marketing_notifications boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow users to select their own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    date_of_birth,
    marketing_email,
    marketing_notifications
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'date_of_birth')::date,
    (new.raw_user_meta_data->'marketing'->>'email')::boolean,
    (new.raw_user_meta_data->'marketing'->>'notifications')::boolean
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add age verification constraint (commented out)
-- DO $$ 
-- BEGIN
--     ALTER TABLE profiles ADD CONSTRAINT age_verification 
--         CHECK (date_of_birth <= current_date - interval '18 years');
-- EXCEPTION
--     WHEN duplicate_object THEN NULL;
-- END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON profiles(email_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON profiles(onboarding_completed);