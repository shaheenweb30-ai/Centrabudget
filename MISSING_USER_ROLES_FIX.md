# Missing User Roles Issue - Fix Guide

## Problem Description

**Issue**: Authenticated users are not getting a free subscription after signing in because they don't have any role assigned to them in the `user_roles` table.

**Root Cause**: The `handle_new_user()` function that runs when a new user signs up only creates a user profile in the `users` table, but it doesn't assign a default role in the `user_roles` table.

## What Happens Currently

1. ✅ User signs up → `auth.users` table gets new row
2. ✅ Trigger fires → `handle_new_user()` function executes
3. ✅ User profile created → Row added to `public.users` table
4. ✅ Default categories created → Rows added to `public.categories` table
5. ❌ **NO ROLE ASSIGNED** → No row added to `public.user_roles` table
6. ❌ User can't access application → No role means no permissions

## Solution

### Option 1: Quick Fix (Immediate)
Run the `quick_fix_user_roles.sql` script in your Supabase SQL editor to assign missing roles to existing users.

### Option 2: Comprehensive Fix (Recommended)
Run the `fix_missing_user_roles.sql` script or apply the migration `20250125000002_fix_missing_user_roles.sql` to:
- Fix existing users without roles
- Update the `handle_new_user()` function to assign default roles for new users

### Option 3: Migration File
Apply the migration file `supabase/migrations/20250125000002_fix_missing_user_roles.sql` through your migration system.

## What the Fix Does

1. **Fixes Existing Users**: Assigns 'user' role to all existing users who don't have any role
2. **Updates Function**: Modifies `handle_new_user()` to automatically assign 'user' role to new users
3. **Ensures Future Users**: All new signups will automatically get the 'user' role (free plan)

## Expected Result

After applying the fix:
- ✅ All existing users will have a 'user' role (free plan)
- ✅ New users will automatically get 'user' role on signup
- ✅ Users can access the application with free plan features
- ✅ Free plan includes: 10 categories, 10 budgets, 10 transactions, 5 AI insights

## Verification

After running the fix, verify it worked by checking:

```sql
-- Check that no users are missing roles
SELECT COUNT(*) as users_without_roles
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;

-- Should return 0

-- Check user role distribution
SELECT 
    ur.role,
    COUNT(*) as user_count
FROM public.user_roles ur
GROUP BY ur.role
ORDER BY ur.role;
```

## Files Created

- `quick_fix_user_roles.sql` - Quick fix for existing users
- `fix_missing_user_roles.sql` - Comprehensive fix with function update
- `supabase/migrations/20250125000002_fix_missing_user_roles.sql` - Proper migration file
- `MISSING_USER_ROLES_FIX.md` - This documentation

## Next Steps

1. **Immediate**: Run the quick fix to restore access for existing users
2. **Long-term**: Apply the migration to prevent this issue for future users
3. **Test**: Create a new test user account to verify the fix works
4. **Monitor**: Check that new users automatically get roles assigned

## Why This Happened

The original `handle_new_user()` function was designed to only create user profiles and categories, but the role assignment system was added later without updating this function. This created a gap where users could authenticate but couldn't access the application due to missing permissions.
