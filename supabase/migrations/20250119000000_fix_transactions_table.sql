-- Fix transactions table schema conflicts
-- Drop existing indexes that might conflict
DROP INDEX IF EXISTS idx_transactions_date;
DROP INDEX IF EXISTS idx_transactions_category;
DROP INDEX IF EXISTS idx_transactions_type;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transactions' AND column_name = 'date') THEN
        ALTER TABLE transactions ADD COLUMN date DATE DEFAULT CURRENT_DATE;
    END IF;
    
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transactions' AND column_name = 'category') THEN
        ALTER TABLE transactions ADD COLUMN category TEXT;
    END IF;
    
    -- Add type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transactions' AND column_name = 'type') THEN
        ALTER TABLE transactions ADD COLUMN type TEXT DEFAULT 'expense';
    END IF;
END $$;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
