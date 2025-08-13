-- Alternative setup script for Package Descriptions
-- This version uses a simpler approach for role checking
-- Run this in your Supabase SQL editor

-- Step 1: Create the package_descriptions table
CREATE TABLE IF NOT EXISTS package_descriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Step 2: Insert default package descriptions
INSERT INTO package_descriptions (plan_id, description, is_enabled) VALUES
  ('free', 'Everything you need to begin your financial journey. No credit card required.', true),
  ('pro', 'Advanced features for users who need more power and flexibility.', true),
  ('enterprise', 'Custom solutions with dedicated support and advanced team features.', true)
ON CONFLICT (plan_id) DO NOTHING;

-- Step 3: Enable RLS
ALTER TABLE package_descriptions ENABLE ROW LEVEL SECURITY;

-- Step 4: Create read policy (all users can read)
CREATE POLICY "Allow public read access to package descriptions" ON package_descriptions
  FOR SELECT USING (true);

-- Step 5: Create write policy (only admins can modify)
-- This policy temporarily allows all authenticated users to modify
-- You can restrict this later by updating the policy
CREATE POLICY "Allow authenticated users to modify package descriptions" ON package_descriptions
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Step 6: Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_package_descriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for automatic timestamp updates
CREATE TRIGGER update_package_descriptions_updated_at
  BEFORE UPDATE ON package_descriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_package_descriptions_updated_at();

-- Step 8: Verify the setup
SELECT 
  'Setup completed successfully!' as status,
  COUNT(*) as total_descriptions,
  COUNT(CASE WHEN is_enabled THEN 1 END) as enabled_descriptions
FROM package_descriptions;

-- Note: This setup allows any authenticated user to modify package descriptions.
-- To restrict to admins only, you'll need to either:
-- 1. Create a user_roles table and update the policy, or
-- 2. Use a custom function to check admin status
