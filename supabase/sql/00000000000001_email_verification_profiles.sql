ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow only verified users"
ON profiles
FOR SELECT USING (auth.jwt()->>'email_confirmed_at' IS NOT NULL);