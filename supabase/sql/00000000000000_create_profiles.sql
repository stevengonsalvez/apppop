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

-- Drop any existing policies to ensure clean state
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;
drop policy if exists "Users can view their own profile." on profiles;
drop policy if exists "Allow email verification update" on profiles;
drop policy if exists "Enable read access for all users" on profiles;
drop policy if exists "Enable insert for authenticated users only" on profiles;
drop policy if exists "Enable update for users based on id" on profiles;
drop policy if exists "Profiles are viewable by owner only" on profiles;

-- Create proper restrictive policies
create policy "Profiles are viewable by owner only"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Ensure the trigger is created
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