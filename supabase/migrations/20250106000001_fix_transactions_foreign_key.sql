-- Fix transactions table foreign key constraint
-- Drop the existing foreign key constraint if it exists
DO $$ 
BEGIN
    -- Check if the constraint exists and drop it
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'transactions_category_id_fkey' 
        AND table_name = 'transactions'
    ) THEN
        ALTER TABLE transactions DROP CONSTRAINT transactions_category_id_fkey;
    END IF;
END $$;

-- Add the correct foreign key constraint to reference categories table
ALTER TABLE transactions 
ADD CONSTRAINT transactions_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

-- Update the index to use category_id instead of category
DROP INDEX IF EXISTS idx_transactions_category;
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);

-- Update the date index to use transaction_date
DROP INDEX IF EXISTS idx_transactions_date;
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_date ON transactions(transaction_date); 