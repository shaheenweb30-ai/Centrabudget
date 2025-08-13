# Multi-Role System Implementation

## Overview
The system now supports users having multiple roles simultaneously. A user can be both an **Admin** AND have a subscription plan (**Free Trial** or **Pro Plan**). This provides flexibility for users who need both administrative privileges and premium features.

## New Role Combinations

### **1. Admin + Pro User (`admin_pro`)**
- **Role**: Admin privileges + Pro subscription
- **Display**: "Admin Pro Plan"
- **Features**: 
  - Full administrative access
  - Unlimited Pro features
  - Premium status badge
  - Invoice download capability

### **2. Admin Only (`admin`)**
- **Role**: Admin privileges only
- **Display**: "Admin Plan"
- **Features**:
  - Full administrative access
  - Unlimited features (same as Pro)
  - Premium status badge
  - Invoice download capability

### **3. Pro User (`subscriber`)**
- **Role**: Pro subscription only
- **Display**: "Pro Plan"
- **Features**:
  - Unlimited Pro features
  - Premium status badge
  - Invoice download capability

### **4. Free User (`user`)**
- **Role**: Basic user
- **Display**: "Free Plan"
- **Features**:
  - Limited features (10 categories, 10 budgets, 10 transactions, 5 AI insights)
  - Active status badge
  - Upgrade to Pro option

## Technical Implementation

### **Database Changes**
- **Multiple Roles**: Users can now have multiple entries in `user_roles` table
- **Role Priority**: Admin role takes precedence for display purposes
- **Plan Determination**: Based on highest available role/subscription

### **useUserPlan Hook Updates**
```tsx
// Before: Single role check
const { data: userRole, error: roleError } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .single();

// After: Multiple roles check
const { data: userRoles, error: roleError } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id);

// Determine roles
const roles = userRoles?.map(r => r.role) || [];
const hasAdminRole = roles.includes('admin');
const hasSubscriberRole = roles.includes('subscriber');
```

### **Plan Logic**
```tsx
if (hasAdminRole && hasSubscriberRole) {
  // Admin + Pro user
  currentPlan: 'admin_pro',
  displayPlan: 'Admin Pro'
} else if (hasAdminRole) {
  // Admin user only
  currentPlan: 'admin',
  displayPlan: 'Admin'
} else if (hasSubscriberRole) {
  // Pro user only
  currentPlan: 'pro',
  displayPlan: 'Pro'
} else {
  // Free user
  currentPlan: 'free',
  displayPlan: 'Free'
}
```

## UI Updates

### **Sidebar Navigation**
- **Admin Pro**: Shows "Admin Pro" with premium styling
- **Admin**: Shows "Admin Plan" with premium styling
- **Pro**: Shows "Pro Plan" with premium styling
- **Free**: Shows "Free Plan" with standard styling

### **Settings → Billing**
- **Plan Display**: Shows accurate plan type
- **Status Badge**: 
  - Admin Pro: "Admin Pro" (premium)
  - Admin: "Premium" (premium)
  - Pro: "Premium" (premium)
  - Free: "Active" (standard)

### **Usage Information**
- **Admin Pro/Admin/Pro**: All show "Unlimited"
- **Free**: Shows actual limits (10/month, 5/month)

### **Action Buttons**
- **Free users**: See "Upgrade to Pro" button
- **Admin Pro/Admin/Pro**: See "Download Invoice" button

## Benefits

### **For Users**
1. **Flexibility**: Can have admin access without losing Pro features
2. **Clear Status**: Always see their actual plan and role
3. **Consistent Experience**: Same features regardless of admin status

### **For Administrators**
1. **Dual Access**: Can manage the system AND use premium features
2. **Role Separation**: Admin privileges don't interfere with subscription
3. **Clear Permissions**: Always know what they can access

### **For System**
1. **Scalable**: Easy to add new role combinations
2. **Maintainable**: Clear logic for determining user capabilities
3. **Flexible**: Supports complex organizational structures

## Usage Examples

### **Scenario 1: Admin Promotes User to Pro**
```sql
-- User already has 'admin' role
-- Add 'subscriber' role
INSERT INTO user_roles (user_id, role) VALUES ('user-id', 'subscriber');

-- Result: User becomes 'admin_pro' with unlimited access
```

### **Scenario 2: Pro User Gets Admin Access**
```sql
-- User already has 'subscriber' role
-- Add 'admin' role
INSERT INTO user_roles (user_id, role) VALUES ('user-id', 'admin');

-- Result: User becomes 'admin_pro' with unlimited access
```

### **Scenario 3: Admin User Downgraded to Free**
```sql
-- Remove 'admin' role, keep 'user' role
DELETE FROM user_roles WHERE user_id = 'user-id' AND role = 'admin';

-- Result: User becomes 'free' with limited access
```

## Migration Notes

### **Existing Users**
- **Admin users**: Automatically get unlimited access (same as before)
- **Pro users**: Continue to have unlimited access
- **Free users**: Continue to have limited access

### **Database Schema**
- No changes required to existing tables
- `user_roles` table already supports multiple roles per user
- Existing queries continue to work

### **Backward Compatibility**
- All existing functionality preserved
- New role combinations are additive
- No breaking changes to existing APIs

## Future Enhancements

### **Potential Role Types**
- **Enterprise Admin**: Company-wide administrative access
- **Team Lead**: Team-specific administrative access
- **Moderator**: Content moderation privileges
- **Analyst**: Data analysis and reporting access

### **Role Hierarchy**
- **Super Admin**: Full system access
- **Admin**: Administrative access
- **Manager**: Team management access
- **User**: Basic user access

### **Feature Permissions**
- **Role-based Access Control (RBAC)**: Fine-grained permissions
- **Feature Flags**: Enable/disable features per role
- **Audit Logging**: Track role and permission changes

## Testing

### **Role Combination Tests**
1. **Admin + Pro**: Verify unlimited access + admin features
2. **Admin Only**: Verify unlimited access + admin features
3. **Pro Only**: Verify unlimited access + no admin features
4. **Free Only**: Verify limited access + no admin features

### **UI Display Tests**
1. **Sidebar**: Verify correct plan display
2. **Settings**: Verify correct plan and status
3. **Navigation**: Verify correct upgrade options
4. **Badges**: Verify correct styling and text

### **Feature Access Tests**
1. **Admin Features**: Verify admin-only functionality
2. **Pro Features**: Verify pro-only functionality
3. **Free Features**: Verify free plan limitations
4. **Cross-role Features**: Verify proper access control

## Troubleshooting

### **Common Issues**
- **Role Not Showing**: Check `user_roles` table for multiple entries
- **Plan Mismatch**: Verify role priority logic
- **UI Inconsistency**: Check component updates for new plan types

### **Debug Commands**
```tsx
// Check user roles
const { data: roles } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', userId);

console.log('User roles:', roles);

// Check current plan
const { currentPlan, displayPlan, role } = useUserPlan();
console.log('Current plan:', { currentPlan, displayPlan, role });
```

## Conclusion

The multi-role system provides a flexible and scalable approach to user management, allowing users to have both administrative privileges and subscription-based features. This system maintains backward compatibility while enabling new organizational structures and user capabilities.
