# Settings System Documentation

## Overview

The settings system provides a centralized way to manage user preferences across the entire application. It includes currency formatting, theme management, date/time formatting, and notification preferences that affect multiple pages.

## Architecture

### Core Components

1. **SettingsContext** (`src/contexts/SettingsContext.tsx`)
   - Manages global user preferences
   - Provides formatting utilities
   - Handles theme switching
   - Persists settings to localStorage

2. **SettingsProvider** (wrapped in App.tsx)
   - Provides settings context to all components
   - Loads saved preferences on app start
   - Applies theme changes in real-time

3. **Settings Page** (`src/pages/Settings.tsx`)
   - User interface for managing preferences
   - Real-time updates through context
   - Form validation and error handling

## User Preferences

### Available Settings

```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  currency_symbol: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  language: string;
  timezone: string;
  notifications: {
    transactions: boolean;
    budgets: boolean;
    reports: boolean;
    security: boolean;
  };
}
```

### Default Values

```typescript
const defaultPreferences = {
  theme: 'system',
  currency: 'USD',
  currency_symbol: '$',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  language: 'en',
  timezone: 'UTC',
  notifications: {
    transactions: true,
    budgets: true,
    reports: true,
    security: true,
  },
};
```

## Usage in Components

### Basic Usage

```tsx
import { useSettings } from "@/contexts/SettingsContext";

const MyComponent = () => {
  const { 
    preferences, 
    updatePreferences, 
    formatCurrency, 
    formatDate, 
    formatTime,
    isDarkMode,
    toggleTheme 
  } = useSettings();

  return (
    <div>
      <p>Currency: {formatCurrency(1234.56)}</p>
      <p>Date: {formatDate(new Date())}</p>
      <p>Time: {formatTime(new Date())}</p>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};
```

### Currency Formatting

The `formatCurrency` function provides consistent currency formatting across the app:

```tsx
// Examples
formatCurrency(1234.56)     // "$1,234.56"
formatCurrency(-567.89)      // "-$567.89"
formatCurrency(0)            // "$0.00"
```

### Date/Time Formatting

```tsx
// Date formatting based on user preference
formatDate(new Date())       // "12/25/2023" (MM/DD/YYYY)
formatDate(new Date())       // "25/12/2023" (DD/MM/YYYY)
formatDate(new Date())       // "2023-12-25" (YYYY-MM-DD)

// Time formatting based on user preference
formatTime(new Date())       // "2:30 PM" (12h)
formatTime(new Date())       // "14:30" (24h)
```

## Page Integration

### Dashboard Page

**Before:**
```tsx
// Hardcoded currency formatting
<div>${dashboardData.totalIncome.toFixed(2)}</div>
```

**After:**
```tsx
// Dynamic currency formatting
const { formatCurrency } = useSettings();
<div>{formatCurrency(dashboardData.totalIncome)}</div>
```

### Transactions Page

**Before:**
```tsx
// Local currency state
const [userSettings, setUserSettings] = useState({
  currency: 'KWD',
  currency_symbol: 'KWD'
});

const formatCurrency = (amount: number) => {
  return `${userSettings.currency_symbol} ${Math.abs(amount).toFixed(2)}`;
};
```

**After:**
```tsx
// Global settings context
const { formatCurrency, preferences } = useSettings();

// Currency symbol from preferences
<div>{preferences.currency_symbol}</div>
```

## Theme System

### Automatic Theme Application

The settings system automatically applies theme changes:

1. **System Theme Detection**: Automatically detects system theme preference
2. **Manual Override**: Users can choose light/dark/system
3. **Real-time Updates**: Theme changes apply immediately
4. **Persistence**: Theme choice is saved to localStorage

### Theme Usage

```tsx
const { isDarkMode, toggleTheme } = useSettings();

// Check if dark mode is active
if (isDarkMode) {
  // Apply dark mode styles
}

// Toggle theme
<button onClick={toggleTheme}>
  {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
</button>
```

## Settings Page Features

### Profile Tab
- Personal information management
- Email (read-only)
- Phone number
- Address
- Timezone selection
- Language selection

### Security Tab
- Password change functionality
- Two-factor authentication toggle
- Email notifications
- SMS notifications

### Preferences Tab
- **Theme Selection**: Light/Dark/System
- **Currency Selection**: USD, EUR, GBP, JPY, etc.
- **Date Format**: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
- **Time Format**: 12-hour, 24-hour
- **Notification Preferences**: 
  - Transaction notifications
  - Budget alerts
  - Report notifications
  - Security notifications

### Billing Tab
- Subscription management
- Data export functionality
- Account backup
- Account deletion

## Data Persistence

### localStorage Structure

```json
{
  "userPreferences": {
    "theme": "system",
    "currency": "USD",
    "currency_symbol": "$",
    "dateFormat": "MM/DD/YYYY",
    "timeFormat": "12h",
    "language": "en",
    "timezone": "UTC",
    "notifications": {
      "transactions": true,
      "budgets": true,
      "reports": true,
      "security": true
    }
  }
}
```

### Loading Process

1. **App Start**: SettingsProvider loads saved preferences
2. **Fallback**: Uses default preferences if none saved
3. **Merge**: Combines saved preferences with defaults
4. **Apply**: Immediately applies theme and other settings

## Error Handling

### Context Usage Errors

```tsx
// Proper error handling for context usage
const MyComponent = () => {
  try {
    const { formatCurrency } = useSettings();
    return <div>{formatCurrency(100)}</div>;
  } catch (error) {
    // Handle case where SettingsProvider is not available
    return <div>Settings not available</div>;
  }
};
```

### Settings Validation

```tsx
// Validate settings before applying
const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
  // Validate currency format
  if (newPreferences.currency && !isValidCurrency(newPreferences.currency)) {
    throw new Error('Invalid currency format');
  }
  
  // Validate date format
  if (newPreferences.dateFormat && !isValidDateFormat(newPreferences.dateFormat)) {
    throw new Error('Invalid date format');
  }
  
  // Apply valid settings
  setPreferences({ ...preferences, ...newPreferences });
};
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**: Settings context uses React.memo for performance
2. **Lazy Loading**: Settings are loaded only when needed
3. **Debounced Updates**: Theme changes are debounced to prevent flickering
4. **Local Storage**: Efficient localStorage usage with error handling

### Memory Management

```tsx
// Cleanup on unmount
useEffect(() => {
  return () => {
    // Cleanup any subscriptions or timers
  };
}, []);
```

## Future Enhancements

### Planned Features

1. **Server Sync**: Sync preferences with user account
2. **Export/Import**: Settings backup and restore
3. **Advanced Themes**: Custom color schemes
4. **Regional Settings**: Locale-specific formatting
5. **Accessibility**: High contrast themes
6. **Analytics**: Track settings usage patterns

### API Integration

```tsx
// Future: Sync with server
const syncSettings = async () => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      preferences: preferences
    });
  
  if (error) {
    console.error('Failed to sync settings:', error);
  }
};
```

## Testing

### Unit Tests

```tsx
// Test settings context
describe('SettingsContext', () => {
  it('should format currency correctly', () => {
    const { formatCurrency } = renderHook(() => useSettings()).result.current;
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
  
  it('should apply theme changes', () => {
    const { updatePreferences } = renderHook(() => useSettings()).result.current;
    updatePreferences({ theme: 'dark' });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
```

### Integration Tests

```tsx
// Test settings page integration
describe('Settings Page', () => {
  it('should save preferences', async () => {
    render(<Settings />);
    
    // Change currency
    fireEvent.change(screen.getByLabelText('Currency'), {
      target: { value: 'EUR' }
    });
    
    // Save preferences
    fireEvent.click(screen.getByText('Save Preferences'));
    
    // Verify localStorage was updated
    expect(JSON.parse(localStorage.getItem('userPreferences')).currency).toBe('EUR');
  });
});
```

## Troubleshooting

### Common Issues

1. **Settings Not Loading**
   - Check if SettingsProvider is wrapped around the app
   - Verify localStorage is available
   - Check for JSON parsing errors

2. **Theme Not Applying**
   - Ensure CSS variables are defined
   - Check if dark mode classes are applied
   - Verify system theme detection

3. **Currency Not Formatting**
   - Check if Intl.NumberFormat is supported
   - Verify currency code is valid
   - Ensure amount is a number

### Debug Tools

```tsx
// Debug settings state
const { preferences } = useSettings();
console.log('Current preferences:', preferences);

// Debug theme state
const { isDarkMode } = useSettings();
console.log('Dark mode active:', isDarkMode);
```

## Migration Guide

### From Local Settings

**Before:**
```tsx
// Local state in each component
const [currency, setCurrency] = useState('USD');
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
```

**After:**
```tsx
// Global settings context
const { formatCurrency, preferences } = useSettings();
// Use formatCurrency() and preferences.currency
```

### From localStorage Direct Access

**Before:**
```tsx
// Direct localStorage access
const settings = JSON.parse(localStorage.getItem('userPreferences'));
```

**After:**
```tsx
// Through settings context
const { preferences, updatePreferences } = useSettings();
```

This settings system provides a robust, scalable foundation for managing user preferences across the entire application while maintaining good performance and user experience.
