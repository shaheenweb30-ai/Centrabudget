-- Create pricing_config table for admin-controlled pricing
CREATE TABLE IF NOT EXISTS pricing_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id TEXT NOT NULL UNIQUE,
  monthly_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  yearly_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pricing configuration
INSERT INTO pricing_config (plan_id, monthly_price, yearly_price) VALUES
  ('pro', 12.00, 120.00)
ON CONFLICT (plan_id) DO NOTHING;

-- Create RLS policies
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read pricing config
CREATE POLICY "Allow authenticated users to read pricing config" ON pricing_config
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow only admin users to modify pricing config
CREATE POLICY "Allow admin users to modify pricing config" ON pricing_config
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pricing_config_plan_id ON pricing_config(plan_id);
CREATE INDEX IF NOT EXISTS idx_pricing_config_updated_at ON pricing_config(updated_at);

-- Grant necessary permissions
GRANT SELECT ON pricing_config TO authenticated;
GRANT ALL ON pricing_config TO service_role;
