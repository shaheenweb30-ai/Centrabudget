-- Comprehensive fix for pricing_config table
-- Run this ENTIRE script in your Supabase SQL editor

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read pricing config" ON pricing_config;
DROP POLICY IF EXISTS "Allow admin users to modify pricing config" ON pricing_config;

-- Step 2: Temporarily disable RLS to clean up
ALTER TABLE pricing_config DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop and recreate the table with correct structure
DROP TABLE IF EXISTS pricing_config CASCADE;

CREATE TABLE pricing_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id TEXT NOT NULL UNIQUE,
  monthly_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  yearly_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Insert default pricing data
INSERT INTO pricing_config (plan_id, monthly_price, yearly_price) VALUES
  ('pro', 12.00, 120.00);

-- Step 5: Enable RLS
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

-- Step 6: Create simple, working policies
-- Policy 1: Allow all authenticated users to READ
CREATE POLICY "Allow authenticated users to read pricing config" ON pricing_config
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy 2: Allow users with admin role to INSERT/UPDATE/DELETE
CREATE POLICY "Allow admin users to modify pricing config" ON pricing_config
  FOR ALL USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Step 7: Grant permissions
GRANT SELECT ON pricing_config TO authenticated;
GRANT ALL ON pricing_config TO service_role;

-- Step 8: Verify the setup
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'pricing_config';

-- Step 9: Test the table
SELECT * FROM pricing_config;

-- Step 10: Show table structure (this will show in the results)
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'pricing_config' 
ORDER BY ordinal_position;
