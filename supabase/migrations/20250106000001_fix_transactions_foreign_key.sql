-- Fix transactions table structure
-- First, add category_id column if it doesn't exist
DO $$ 
BEGIN
    -- Check if category_id column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'transactions' 
        AND column_name = 'category_id'
    ) THEN
        -- Add category_id column
        ALTER TABLE transactions ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE CASCADE;
        
        -- Migrate existing category data to category_id
        UPDATE transactions 
        SET category_id = (
            SELECT id FROM categories 
            WHERE categories.name = transactions.category 
            AND categories.user_id = transactions.user_id
            LIMIT 1
        );
    END IF;
END $$;

-- Update the index to use category_id
DROP INDEX IF EXISTS idx_transactions_category;
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id); 