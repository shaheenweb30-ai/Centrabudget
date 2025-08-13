-- Migration: Add blank financial data on user signup
-- This migration modifies the existing handle_new_user function to create
-- blank/default entries for Transactions, Categories, and Budgets when a new user signs up

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the enhanced function that creates blank financial data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Create default categories for the new user
  INSERT INTO public.categories (name, icon, color, user_id) VALUES
    ('Food & Dining', '🍽️', '#FF6B6B', NEW.id),
    ('Transportation', '🚗', '#4ECDC4', NEW.id),
    ('Shopping', '🛍️', '#45B7D1', NEW.id),
    ('Entertainment', '🎬', '#96CEB4', NEW.id),
    ('Healthcare', '🏥', '#FFEAA7', NEW.id),
    ('Utilities', '💡', '#DDA0DD', NEW.id),
    ('Housing', '🏠', '#98D8C8', NEW.id),
    ('Income', '💰', '#F7DC6F', NEW.id),
    ('Other', '📌', '#BB8FCE', NEW.id);
  
  -- Note: Transactions and Budgets tables will remain empty by default
  -- Users will add their own transactions and budgets as needed
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add comment to document the function
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates user profile and default categories when a new user signs up. Transactions and budgets start empty.';
