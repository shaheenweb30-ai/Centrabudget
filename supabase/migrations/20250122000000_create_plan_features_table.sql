-- Create plan features table for admin configuration
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id TEXT NOT NULL,
  feature_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_plan_features_plan_id ON plan_features(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_features_display_order ON plan_features(display_order);

-- Insert default features for each plan
INSERT INTO plan_features (plan_id, feature_text, display_order, is_enabled) VALUES
  -- Free plan features
  ('free', '10 categories per month', 1, true),
  ('free', '10 budgets per month', 2, true),
  ('free', '10 transactions per month', 3, true),
  ('free', '5 AI insights per month', 4, true),
  ('free', 'Basic recurring detection', 5, true),
  ('free', 'Monthly budget periods', 6, true),
  ('free', 'Community support', 7, true),
  ('free', 'Mobile app access', 8, true),
  ('free', 'Basic reports', 9, true),
  ('free', 'Export to CSV', 10, true),
  
  -- Pro plan features
  ('pro', 'Unlimited categories', 1, true),
  ('pro', 'Unlimited budgets', 2, true),
  ('pro', 'Unlimited transactions', 3, true),
  ('pro', '50+ AI insights per month', 4, true),
  ('pro', 'Advanced recurring detection', 5, true),
  ('pro', 'Custom budget periods', 6, true),
  ('pro', 'Receipt attachments', 7, true),
  ('pro', 'Team collaboration (up to 5 users)', 8, true),
  ('pro', 'API access', 9, true),
  ('pro', 'Priority support (email + chat)', 10, true),
  ('pro', 'Advanced analytics', 11, true),
  ('pro', 'Custom categories', 12, true),
  ('pro', 'Budget templates', 13, true),
  ('pro', 'Financial goals tracking', 14, true),
  ('pro', 'Investment tracking', 15, true),
  
  -- Enterprise plan features
  ('enterprise', 'Everything in Pro', 1, true),
  ('enterprise', 'Unlimited team collaboration', 2, true),
  ('enterprise', 'Advanced team analytics', 3, true),
  ('enterprise', 'Custom integrations', 4, true),
  ('enterprise', 'Dedicated account manager', 5, true),
  ('enterprise', 'SLA guarantees', 6, true),
  ('enterprise', 'Custom reporting', 7, true),
  ('enterprise', 'White-label options', 8, true),
  ('enterprise', 'Advanced security features', 9, true),
  ('enterprise', 'Compliance reporting', 10, true)
ON CONFLICT DO NOTHING;

-- Create RLS policies
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;

-- Allow all users to read plan features
CREATE POLICY "Allow public read access to plan features" ON plan_features
  FOR SELECT USING (true);

-- Allow only admins to modify plan features
CREATE POLICY "Allow admin write access to plan features" ON plan_features
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_plan_features_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_plan_features_updated_at
  BEFORE UPDATE ON plan_features
  FOR EACH ROW
  EXECUTE FUNCTION update_plan_features_updated_at();
