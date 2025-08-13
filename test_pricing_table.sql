-- Test the pricing_config table
-- Run this in Supabase SQL Editor

-- 1. Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default,
  is_identity
FROM information_schema.columns 
WHERE table_name = 'pricing_config' 
ORDER BY ordinal_position;

-- 2. Check current data
SELECT * FROM pricing_config;

-- 3. Check constraints
SELECT 
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'pricing_config';

-- 4. Check unique constraints specifically
SELECT 
  tc.constraint_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'pricing_config' 
  AND tc.constraint_type = 'UNIQUE';

-- 5. Test insert (should work)
INSERT INTO pricing_config (plan_id, monthly_price, yearly_price) 
VALUES ('test-plan', 99.99, 999.99)
ON CONFLICT (plan_id) DO NOTHING;

-- 6. Test update (should work)
UPDATE pricing_config 
SET monthly_price = 88.88 
WHERE plan_id = 'test-plan';

-- 7. Clean up test data
DELETE FROM pricing_config WHERE plan_id = 'test-plan';

-- 8. Show final state
SELECT * FROM pricing_config;
