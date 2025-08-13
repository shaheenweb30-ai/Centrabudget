# Blank Financial Data on User Signup

This document explains how to ensure that when a new user signs up, their Transactions, Categories, and Budget entities start completely blank.

## Current Situation

Currently, when a user signs up:
- A user profile is created in the `users` table
- The `transactions`, `categories`, and `budgets` tables start empty (which is what we want)

## Migration Options

### Option 1: Completely Blank (Recommended)
**File**: `supabase/migrations/20250125000001_ensure_blank_financial_data.sql`

This migration ensures:
- ✅ User profile is created
- ✅ Transactions table starts empty
- ✅ Categories table starts empty  
- ✅ Budgets table starts empty
- ✅ No default data is inserted

### Option 2: Blank with Default Categories
**File**: `supabase/migrations/20250125000000_add_blank_financial_data_on_signup.sql`

This migration ensures:
- ✅ User profile is created
- ✅ Transactions table starts empty
- ✅ Budgets table starts empty
- ⚠️ Categories table gets 9 default categories (Food & Dining, Transportation, etc.)

## Implementation

### To apply Option 1 (Completely Blank):
```sql
-- Run this in your Supabase SQL editor
\i supabase/migrations/20250125000001_ensure_blank_financial_data.sql
```

### To apply Option 2 (Blank with Default Categories):
```sql
-- Run this in your Supabase SQL editor
\i supabase/migrations/20250125000000_add_blank_financial_data_on_signup.sql
```

## What Happens After Migration

1. **New User Signs Up** → `auth.users` table gets new row
2. **Trigger Fires** → `handle_new_user()` function executes
3. **User Profile Created** → Row added to `public.users` table
4. **Financial Tables** → Remain completely empty (Option 1) or get default categories (Option 2)

## Verification

After applying the migration, you can verify it works by:

1. Creating a new test user account
2. Checking that the `transactions` table is empty for that user
3. Checking that the `categories` table is empty (Option 1) or has default categories (Option 2)
4. Checking that the `budgets` table is empty for that user

## Rollback

If you need to rollback, you can restore the original function:

```sql
-- Restore original function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Recommendation

**Use Option 1** (completely blank) if you want users to start with a clean slate and build their financial data from scratch.

**Use Option 2** (with default categories) if you want to give users a head start with common spending categories that they can modify or delete as needed.
