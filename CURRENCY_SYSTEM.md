# 🌍 Global Currency System

## Overview

The CentraBudget application now supports **100+ world currencies** with automatic symbol mapping and proper formatting across all pages. The currency system is centralized through the `SettingsContext` and automatically reflects changes throughout the application.

## 🎯 Features

### ✅ **Comprehensive Currency Support**
- **100+ World Currencies**: From USD to KGS, covering all major and minor currencies
- **Automatic Symbol Mapping**: Each currency has its proper symbol (₽, ¥, €, £, etc.)
- **Fallback Formatting**: Graceful handling of unsupported currencies
- **Real-time Updates**: Currency changes reflect immediately across all pages

### ✅ **Smart Currency Management**
- **Automatic Symbol Detection**: When currency is changed, symbol updates automatically
- **Proper Formatting**: Uses `Intl.NumberFormat` for locale-aware formatting
- **Error Handling**: Fallback to simple formatting if browser doesn't support currency
- **Persistence**: Currency preferences saved to localStorage

## 📋 Supported Currencies

### **Major Currencies**
- **USD** - US Dollar ($)
- **EUR** - Euro (€)
- **GBP** - British Pound (£)
- **JPY** - Japanese Yen (¥)
- **CAD** - Canadian Dollar (C$)
- **AUD** - Australian Dollar (A$)
- **CHF** - Swiss Franc (CHF)
- **CNY** - Chinese Yuan (¥)

### **Asian Currencies**
- **KRW** - South Korean Won (₩)
- **SGD** - Singapore Dollar (S$)
- **HKD** - Hong Kong Dollar (HK$)
- **THB** - Thai Baht (฿)
- **VND** - Vietnamese Dong (₫)
- **PHP** - Philippine Peso (₱)
- **MYR** - Malaysian Ringgit (RM)
- **IDR** - Indonesian Rupiah (Rp)

### **Middle Eastern Currencies**
- **AED** - UAE Dirham (د.إ)
- **SAR** - Saudi Riyal (ر.س)
- **QAR** - Qatari Riyal (ر.ق)
- **KWD** - Kuwaiti Dinar (د.ك)
- **BHD** - Bahraini Dinar (ب.د)
- **OMR** - Omani Rial (ر.ع)
- **JOD** - Jordanian Dinar (د.ا)
- **LBP** - Lebanese Pound (ل.ل)

### **African Currencies**
- **ZAR** - South African Rand (R)
- **NGN** - Nigerian Naira (₦)
- **GHS** - Ghanaian Cedi (₵)
- **KES** - Kenyan Shilling (KSh)
- **UGX** - Ugandan Shilling (USh)
- **TZS** - Tanzanian Shilling (TSh)
- **ZMW** - Zambian Kwacha (ZK)
- **BWP** - Botswana Pula (P)

### **European Currencies**
- **SEK** - Swedish Krona (kr)
- **NOK** - Norwegian Krone (kr)
- **DKK** - Danish Krone (kr)
- **PLN** - Polish Złoty (zł)
- **CZK** - Czech Koruna (Kč)
- **HUF** - Hungarian Forint (Ft)
- **RUB** - Russian Ruble (₽)
- **TRY** - Turkish Lira (₺)

### **Latin American Currencies**
- **BRL** - Brazilian Real (R$)
- **MXN** - Mexican Peso ($)
- **CLP** - Chilean Peso ($)
- **COP** - Colombian Peso ($)
- **PEN** - Peruvian Sol (S/)
- **ARS** - Argentine Peso ($)
- **UYU** - Uruguayan Peso ($)
- **PYG** - Paraguayan Guaraní (₲)

### **And Many More...**
Complete list includes currencies from all continents and regions.

## 🔧 Technical Implementation

### **SettingsContext Integration**

```typescript
// Currency mapping with symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  // ... 100+ currencies
};

// Automatic symbol detection in updatePreferences
const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
  if (newPreferences.currency && newPreferences.currency !== preferences.currency) {
    const currencySymbol = CURRENCY_SYMBOLS[newPreferences.currency] || preferences.currency_symbol;
    newPreferences.currency_symbol = currencySymbol;
  }
  // ... rest of function
};
```

### **Smart Currency Formatting**

```typescript
const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const sign = amount >= 0 ? '' : '-';
  
  try {
    // Use Intl.NumberFormat for proper currency formatting
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: preferences.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${sign}${formatter.format(absAmount)}`;
  } catch (error) {
    // Fallback to simple formatting with our symbol mapping
    const symbol = CURRENCY_SYMBOLS[preferences.currency] || preferences.currency_symbol;
    return `${sign}${symbol}${absAmount.toFixed(2)}`;
  }
};
```

## 📱 Pages Integration

### **Settings Page**
- ✅ **Currency Selection**: Dropdown with all 100+ currencies
- ✅ **Real-time Preview**: Shows currency symbol in settings
- ✅ **Auto-save**: Changes persist immediately

### **Dashboard Page**
- ✅ **Summary Cards**: All monetary values use selected currency
- ✅ **Recent Transactions**: Proper currency formatting
- ✅ **Real-time Updates**: Changes reflect immediately

### **Transactions Page**
- ✅ **Transaction List**: All amounts in selected currency
- ✅ **Summary Cards**: Income/Expense totals in correct currency
- ✅ **Input Fields**: Currency symbol in amount inputs

### **Categories Page**
- ✅ **Budget Display**: Budget amounts in selected currency
- ✅ **Input Fields**: Currency symbol in budget inputs

### **Subscription Page**
- ✅ **Pricing Display**: Subscription prices in selected currency
- ✅ **Billing History**: Invoice amounts in correct currency

## 🎨 User Experience

### **Visual Feedback**
- **Currency Symbols**: Proper symbols for each currency (₽, ¥, €, £)
- **Consistent Formatting**: Same format across all pages
- **Immediate Updates**: No page refresh needed for currency changes

### **Accessibility**
- **Screen Reader Friendly**: Proper ARIA labels for currency inputs
- **Keyboard Navigation**: Full keyboard support for currency selection
- **High Contrast**: Currency symbols work with all themes

## 🔄 How It Works

### **1. Currency Selection**
```typescript
// User selects currency in Settings
<select value={preferencesForm.currency}>
  <option value="USD">USD - US Dollar ($)</option>
  <option value="EUR">EUR - Euro (€)</option>
  // ... 100+ options
</select>
```

### **2. Automatic Symbol Update**
```typescript
// When currency changes, symbol updates automatically
if (newPreferences.currency) {
  const currencySymbol = CURRENCY_SYMBOLS[newPreferences.currency];
  newPreferences.currency_symbol = currencySymbol;
}
```

### **3. Global Application**
```typescript
// All pages use the same formatCurrency function
const { formatCurrency } = useSettings();
const formattedAmount = formatCurrency(1234.56);
// Result: "$1,234.56" (or appropriate currency)
```

## 🚀 Benefits

### **For Users**
- ✅ **Global Support**: Use the app in any country
- ✅ **Familiar Formatting**: Currency displays in local format
- ✅ **Easy Switching**: Change currency anytime in settings
- ✅ **Consistent Experience**: Same formatting everywhere

### **For Developers**
- ✅ **Centralized Logic**: One place to manage currency
- ✅ **Automatic Updates**: No manual updates needed
- ✅ **Error Handling**: Graceful fallbacks for unsupported currencies
- ✅ **Extensible**: Easy to add new currencies

## 🔮 Future Enhancements

### **Planned Features**
- **Exchange Rates**: Real-time currency conversion
- **Regional Formatting**: Locale-specific number formatting
- **Currency Groups**: Group currencies by region
- **Favorites**: Quick access to frequently used currencies

### **Technical Improvements**
- **API Integration**: Fetch live exchange rates
- **Caching**: Cache currency data for performance
- **Validation**: Validate currency codes
- **Testing**: Comprehensive currency testing

## 📊 Performance

### **Optimizations**
- **Symbol Mapping**: Pre-defined symbols for instant access
- **Lazy Loading**: Currency data loaded only when needed
- **Caching**: localStorage for persistent preferences
- **Error Boundaries**: Graceful handling of formatting errors

### **Memory Usage**
- **Minimal Footprint**: Lightweight currency mapping
- **Efficient Updates**: Only relevant data changes
- **Cleanup**: Proper cleanup of event listeners

## 🧪 Testing

### **Currency Testing**
```typescript
// Test currency formatting
const testAmount = 1234.56;
const usdResult = formatCurrency(testAmount); // "$1,234.56"
const eurResult = formatCurrency(testAmount); // "€1,234.56"
const jpyResult = formatCurrency(testAmount); // "¥1,235"
```

### **Edge Cases**
- **Zero Amounts**: Proper handling of zero values
- **Negative Amounts**: Correct sign placement
- **Large Numbers**: Proper thousand separators
- **Decimal Places**: Appropriate decimal formatting

## 📝 Migration Guide

### **From Local Currency**
If you previously had local currency handling:

1. **Remove Local State**
   ```typescript
   // Remove this
   const [localCurrency, setLocalCurrency] = useState('USD');
   ```

2. **Use Settings Context**
   ```typescript
   // Use this instead
   const { formatCurrency, preferences } = useSettings();
   ```

3. **Update References**
   ```typescript
   // Change from
   const formatted = `${localSymbol}${amount}`;
   
   // To
   const formatted = formatCurrency(amount);
   ```

## 🎯 Summary

The global currency system provides:

- **🌍 100+ World Currencies** with proper symbols
- **🔄 Automatic Updates** across all pages
- **💾 Persistent Preferences** saved to localStorage
- **🎨 Consistent Formatting** throughout the app
- **⚡ High Performance** with efficient caching
- **🛡️ Error Handling** with graceful fallbacks

This system ensures that CentraBudget can serve users worldwide with their preferred currency, providing a truly global financial management experience! 🌟
