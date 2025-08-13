# Package Description & Features Configurator

This feature allows administrators to configure and toggle package descriptions and features on the pricing page through an admin interface.

## Features

- **Configurable Descriptions**: Edit package descriptions for Free, Pro, and Enterprise plans
- **Configurable Features**: Edit, add, delete, and reorder plan features
- **Toggle Visibility**: Enable/disable descriptions and features with toggle switches
- **Drag & Drop Reordering**: Reorder features with intuitive drag and drop interface
- **Real-time Updates**: Changes are applied immediately to the pricing page
- **Admin-Only Access**: Only users with admin role can modify content
- **Audit Trail**: Tracks who made changes and when

## Setup Instructions

### 1. Database Setup

**Package Descriptions Table:**
- **Option A**: Use `setup_package_descriptions.sql` (Recommended)
- **Option B**: Use `setup_package_descriptions_alternative.sql` (if you encounter role-related errors)
- **Option C**: Run the migration file with `npx supabase db push`

**Plan Features Table:**
- Use `setup_plan_features.sql` to create the features table
- This table stores all configurable features for each plan

**Note:** If you get an error about `user_metadata` or role checking, use the alternative setup scripts which provide simpler approaches.

### 2. Access the Admin Interface

1. Navigate to the admin dashboard
2. In the sidebar, click on "Package Descriptions" under the Admin section for descriptions
3. Click on "Plan Features" under the Admin section for feature management
4. Both interfaces will show all three plans (Free, Pro, Enterprise)

### 3. Using the Interface

#### Quick Toggle
- Use the toggle switch next to each plan to quickly enable/disable descriptions
- Use the toggle switch next to each feature to quickly enable/disable features
- Changes are applied immediately

#### Edit Descriptions
1. Click the "Edit" button for any plan
2. Modify the description text (max 500 characters)
3. Toggle the "Enable Description" switch if needed
4. Click "Save" to apply changes

#### Manage Features
1. Click the "Edit" button for any feature to modify text and display order
2. Use the "Add Feature" button to create new features
3. Drag and drop features to reorder them
4. Use the toggle switch to enable/disable individual features
5. Click the delete button to remove unwanted features

#### Status Indicators
- **Visible**: Green badge showing the description is active on the pricing page
- **Hidden**: Gray badge showing the description is hidden from the pricing page
- **Active Features**: Green checkmark showing the feature is visible
- **Disabled Features**: Gray appearance with strikethrough text

## How It Works

### Frontend Integration
- The pricing page (`/pricing`) automatically uses configurable descriptions and features
- If a description is disabled, it falls back to the default description from the pricing context
- If no configurable features are set, it falls back to default features from the pricing context
- Changes are reflected immediately without page refresh

### Database Structure

**Package Descriptions Table:**
```sql
package_descriptions
├── id (UUID, Primary Key)
├── plan_id (TEXT, Unique)
├── description (TEXT)
├── is_enabled (BOOLEAN)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── updated_by (UUID, References auth.users)
```

**Plan Features Table:**
```sql
plan_features
├── id (UUID, Primary Key)
├── plan_id (TEXT)
├── feature_text (TEXT)
├── display_order (INTEGER)
├── is_enabled (BOOLEAN)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── updated_by (UUID, References auth.users)
```

### Security
- **Read Access**: All users can read package descriptions and features
- **Write Access**: Only users with admin role can modify descriptions and features
- **Row Level Security (RLS)**: Enforced at the database level

## API Endpoints

The system uses Supabase client with the following operations:

**Package Descriptions:**
- **SELECT**: Fetch all package descriptions
- **UPDATE**: Modify description text and enabled status
- **Automatic**: `updated_at` and `updated_by` fields are managed automatically

**Plan Features:**
- **SELECT**: Fetch all plan features
- **INSERT**: Add new features
- **UPDATE**: Modify feature text, display order, and enabled status
- **DELETE**: Remove features
- **Automatic**: `updated_at` and `updated_by` fields are managed automatically

## Context Usage

### Package Descriptions Context
```typescript
import { usePackageDescriptions } from '@/contexts/PackageDescriptionsContext';

const { descriptions, updateDescription, toggleDescription } = usePackageDescriptions();
```

**Available Methods:**
- `updateDescription(planId, description, isEnabled)`: Update description and status
- `toggleDescription(planId, isEnabled)`: Quick toggle of enabled status
- `getDescriptionByPlanId(planId)`: Get specific plan description
- `refreshDescriptions()`: Refresh data from database

### Plan Features Context
```typescript
import { usePlanFeatures } from '@/contexts/PlanFeaturesContext';

const { features, getFeaturesByPlanId, updateFeature, addFeature, deleteFeature } = usePlanFeatures();
```

**Available Methods:**
- `getFeaturesByPlanId(planId)`: Get features for a specific plan
- `updateFeature(featureId, updates)`: Update feature properties
- `addFeature(planId, featureText, displayOrder)`: Add new feature
- `deleteFeature(featureId)`: Remove feature
- `toggleFeature(featureId, isEnabled)`: Toggle feature visibility
- `reorderFeatures(planId, featureIds)`: Reorder features
- `refreshFeatures()`: Refresh data from database

## Default Content

### Default Descriptions
The system comes with these default descriptions:

- **Free**: "Everything you need to begin your financial journey. No credit card required."
- **Pro**: "Advanced features for users who need more power and flexibility."
- **Enterprise**: "Custom solutions with dedicated support and advanced team features."

### Default Features
The system comes with comprehensive default features for each plan:

- **Free Plan**: 10 features including categories, budgets, transactions, AI insights, etc.
- **Pro Plan**: 15 features including unlimited access, advanced features, team collaboration, etc.
- **Enterprise Plan**: 10 features including everything in Pro plus enterprise-specific features

## Troubleshooting

### Common Issues

1. **"Failed to fetch package descriptions"**
   - Check if the `package_descriptions` table exists
   - Verify RLS policies are correctly set up
   - Ensure database connection is working

2. **"User does not have admin privileges"**
   - Verify user has admin role in the `user_roles` table
   - Check RLS policy for admin access

3. **Changes not appearing on pricing page**
   - Verify the description is enabled (`is_enabled = true`)
   - Check browser console for errors
   - Ensure the PackageDescriptionsProvider is wrapping the app

4. **"ERROR: 42703: column users.user_metadata does not exist"**
   - This error occurs when the RLS policy tries to access non-existent columns
   - Use the alternative setup script (`setup_package_descriptions_alternative.sql`)
   - Or manually update the RLS policy to use the correct table structure

### Debug Steps

1. Check browser console for error messages
2. Verify database table structure
3. Test RLS policies with direct database queries
4. Check user role in the `user_roles` table

## Future Enhancements

Potential improvements for future versions:

- **Bulk Operations**: Edit multiple descriptions at once
- **Version History**: Track changes over time
- **Rich Text Editor**: Support for formatted descriptions
- **Localization**: Multi-language description support
- **Scheduling**: Set descriptions to change at specific times
- **A/B Testing**: Test different descriptions with user segments

## Support

For technical support or questions about this feature:

1. Check the browser console for error messages
2. Verify database setup and permissions
3. Review the context implementation
4. Check user authentication and role settings
