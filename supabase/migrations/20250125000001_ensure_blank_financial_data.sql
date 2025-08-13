-- Alternative Migration: Ensure completely blank financial data on user signup
-- This migration ensures that Transactions, Categories, and Budgets tables
-- start completely empty for new users (no default categories)

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function that creates only user profile (no default categories)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile only
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Transactions, Categories, and Budgets tables will remain completely empty
  -- Users will add their own data as needed
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add comment to document the function
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates user profile only. All financial data tables (transactions, categories, budgets) start completely empty.';
