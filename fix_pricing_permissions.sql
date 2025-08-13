-- Fix pricing_config table permissions and RLS policies
-- Run this in your Supabase SQL editor

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read pricing config" ON pricing_config;
DROP POLICY IF EXISTS "Allow admin users to modify pricing config" ON pricing_config;

-- Create a simpler read policy that allows all authenticated users to read
CREATE POLICY "Allow authenticated users to read pricing config" ON pricing_config
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create a simpler admin policy that checks JWT claims instead of querying users table
CREATE POLICY "Allow admin users to modify pricing config" ON pricing_config
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Grant necessary permissions
GRANT SELECT ON pricing_config TO authenticated;
GRANT ALL ON pricing_config TO service_role;

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'pricing_config';

-- Show current table structure
\d pricing_config
