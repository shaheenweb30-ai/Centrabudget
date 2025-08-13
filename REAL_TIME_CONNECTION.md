# Real-Time Connection: Transactions ↔ Dashboard

## Overview

The CentraBudget application now features a real-time connection between the Transactions page and the Dashboard, ensuring that all financial data is automatically synchronized and up-to-date.

## How It Works

### 1. Real-Time Hook (`useRealtimeDashboard`)

The dashboard uses a custom hook that:
- Fetches initial data when the component mounts
- Sets up a real-time subscription to the `transactions` table
- Automatically refetches data when transactions change
- Provides real-time updates for all dashboard metrics

### 2. Supabase Real-Time Subscriptions

The hook establishes a real-time channel that listens for:
- `INSERT` events (new transactions)
- `UPDATE` events (modified transactions)
- `DELETE` events (removed transactions)

### 3. Automatic Data Synchronization

When a transaction is:
- **Added**: Dashboard immediately shows new totals, income/expense changes
- **Modified**: Dashboard recalculates all affected metrics
- **Deleted**: Dashboard removes the transaction from all calculations

## Key Features

### Real-Time Metrics
- Total balance updates instantly
- Income/expense totals recalculate automatically
- Budget utilization percentages update in real-time
- Transaction counts and frequencies update immediately
- Category spending updates automatically

### Performance Optimizations
- Efficient database queries with proper indexing
- Debounced updates to prevent excessive API calls
- Smart filtering by user and date ranges
- Cached category and budget data

### User Experience
- No manual refresh required
- Instant feedback when adding transactions
- Consistent data across all components
- Loading states during updates

## Technical Implementation

### Database Schema
```sql
-- Transactions table with real-time enabled
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable real-time for the table
ALTER TABLE transactions REPLICA IDENTITY FULL;
```

### Hook Structure
```typescript
export const useRealtimeDashboard = () => {
  // State management
  const [dashboardData, setDashboardData] = useState<DashboardData>({...});
  const [loading, setLoading] = useState(true);

  // Data fetching function
  const fetchDashboardData = useCallback(async () => {
    // Fetch transactions, categories, budgets
    // Calculate all metrics
    // Update state
  }, [user, selectedPeriod, preferences.fixedCosts]);

  // Real-time subscription
  useEffect(() => {
    // Set up Supabase real-time channel
    const channel = supabase
      .channel('dashboard-transactions')
      .on('postgres_changes', {...}, () => {
        fetchDashboardData(); // Refetch on changes
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, fetchDashboardData]);

  return { dashboardData, loading, refetch: fetchDashboardData };
};
```

## Usage Examples

### Adding a Transaction
1. User navigates to `/transactions`
2. Fills out transaction form
3. Submits the form
4. **Dashboard automatically updates** with new totals
5. No manual refresh needed

### Modifying a Transaction
1. User edits an existing transaction
2. Changes amount from $50 to $75
3. **Dashboard immediately reflects** the $25 difference
4. All related metrics update automatically

### Deleting a Transaction
1. User removes a transaction
2. **Dashboard recalculates** all totals
3. Budget utilization percentages update
4. Transaction counts decrease

## Benefits

### For Users
- **Instant Feedback**: See changes immediately
- **No Manual Refresh**: Dashboard stays current automatically
- **Consistent Data**: Same numbers across all views
- **Better UX**: Smooth, responsive financial tracking

### For Developers
- **Maintainable Code**: Centralized data management
- **Real-Time Capabilities**: Built on Supabase's robust infrastructure
- **Scalable Architecture**: Hook pattern for reusability
- **Type Safety**: Full TypeScript support

## Troubleshooting

### Dashboard Not Updating
1. Check browser console for errors
2. Verify Supabase real-time is enabled
3. Ensure user authentication is active
4. Check network connectivity

### Performance Issues
1. Monitor database query performance
2. Check for excessive real-time events
3. Verify proper cleanup of subscriptions
4. Review transaction volume

## Future Enhancements

- **WebSocket Fallback**: Alternative real-time method
- **Offline Support**: Queue updates when offline
- **Batch Updates**: Group multiple changes
- **Push Notifications**: Alert users to important changes
- **Data Analytics**: Track usage patterns

## Conclusion

The real-time connection between transactions and dashboard provides a seamless, professional financial management experience. Users can trust that their financial data is always current, while developers benefit from a clean, maintainable architecture.
