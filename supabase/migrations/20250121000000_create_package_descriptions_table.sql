-- Create package descriptions table for admin configuration
CREATE TABLE IF NOT EXISTS package_descriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default package descriptions
INSERT INTO package_descriptions (plan_id, description, is_enabled) VALUES
  ('free', 'Everything you need to begin your financial journey. No credit card required.', true),
  ('pro', 'Advanced features for users who need more power and flexibility.', true),
  ('enterprise', 'Custom solutions with dedicated support and advanced team features.', true)
ON CONFLICT (plan_id) DO NOTHING;

-- Create RLS policies
ALTER TABLE package_descriptions ENABLE ROW LEVEL SECURITY;

-- Allow all users to read package descriptions
CREATE POLICY "Allow public read access to package descriptions" ON package_descriptions
  FOR SELECT USING (true);

-- Allow only admins to modify package descriptions
CREATE POLICY "Allow admin write access to package descriptions" ON package_descriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_package_descriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_package_descriptions_updated_at
  BEFORE UPDATE ON package_descriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_package_descriptions_updated_at();
