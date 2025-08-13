-- Check if pricing_config table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'pricing_config'
);

-- If table doesn't exist, create it
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
  ('pro', 12.00, 120.00),
  ('enterprise', 29.00, 290.00)
ON CONFLICT (plan_id) DO NOTHING;

-- Enable RLS
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow authenticated users to read pricing config" ON pricing_config;
DROP POLICY IF EXISTS "Allow admin users to modify pricing config" ON pricing_config;

CREATE POLICY "Allow authenticated users to read pricing config" ON pricing_config
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin users to modify pricing config" ON pricing_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT ON pricing_config TO authenticated;
GRANT ALL ON pricing_config TO service_role;

-- Show current data
SELECT * FROM pricing_config;
