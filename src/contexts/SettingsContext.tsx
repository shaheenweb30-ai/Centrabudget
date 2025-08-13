import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  currency_symbol: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  language: string;
  timezone: string;
  budgetPeriod?: 'monthly' | 'quarterly' | 'yearly';
  fixedCosts?: { amount: number; categoryId: string }[];
  notifications: {
    transactions: boolean;
    budgets: boolean;
    reports: boolean;
    security: boolean;
  };
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  timezone: string;
  language: string;
}

interface SettingsContextType {
  preferences: UserPreferences;
  userProfile: UserProfile;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  updateUserProfile: (newProfile: Partial<UserProfile>) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  shouldApplyDarkTheme: () => boolean;
}

// Currency mapping with symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  BRL: 'R$',
  MXN: '$',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RUB: '₽',
  TRY: '₺',
  ZAR: 'R',
  ILS: '₪',
  AED: 'د.إ',
  SAR: 'ر.س',
  QAR: 'ر.ق',
  KWD: 'د.ك',
  BHD: 'ب.د',
  OMR: 'ر.ع',
  JOD: 'د.ا',
  LBP: 'ل.ل',
  EGP: 'ج.م',
  NGN: '₦',
  GHS: '₵',
  KES: 'KSh',
  UGX: 'USh',
  TZS: 'TSh',
  ZMW: 'ZK',
  BWP: 'P',
  NAD: 'N$',
  MUR: '₨',
  SCR: '₨',
  MAD: 'د.م',
  TND: 'د.ت',
  DZD: 'د.ج',
  LYD: 'ل.د',
  SDG: 'ج.س',
  ETB: 'Br',
  SOS: 'S',
  DJF: 'Fdj',
  KMF: 'CF',
  MGA: 'Ar',
  XOF: 'CFA',
  XAF: 'FCFA',
  XPF: '₣',
  CLP: '$',
  COP: '$',
  PEN: 'S/',
  ARS: '$',
  UYU: '$',
  PYG: '₲',
  BOB: 'Bs',
  VEF: 'Bs',
  GTQ: 'Q',
  HNL: 'L',
  NIO: 'C$',
  CRC: '₡',
  PAB: 'B/',
  DOP: 'RD$',
  JMD: 'J$',
  TTD: 'TT$',
  BBD: 'Bds$',
  XCD: 'EC$',
  ANG: 'ƒ',
  AWG: 'ƒ',
  KYD: 'CI$',
  BMD: 'BD$',
  BZD: 'BZ$',
  GYD: 'G$',
  SRD: '$',
  FJD: 'FJ$',
  WST: 'T',
  TOP: 'T$',
  VUV: 'VT',
  SBD: 'SI$',
  PGK: 'K',
  HTG: 'G',
  CUP: '$',
  CUC: 'CUC$',
  BSD: 'B$',
  KHR: '៛',
  LAK: '₭',
  MMK: 'K',
  THB: '฿',
  VND: '₫',
  PHP: '₱',
  MYR: 'RM',
  IDR: 'Rp',
  BDT: '৳',
  LKR: 'Rs',
  NPR: '₨',
  PKR: '₨',
  AFN: '؋',
  IRR: '﷼',
  IQD: 'ع.د',
  KZT: '₸',
  UZS: 'so\'m',
  TJS: 'ЅМ',
  TMT: 'T',
  GEL: '₾',
  AMD: '֏',
  AZN: '₼',
  BYN: 'Br',
  MDL: 'L',
  UAH: '₴',
  RSD: 'дин',
  BAM: 'KM',
  HRK: 'kn',
  BGN: 'лв',
  RON: 'lei',
  ALL: 'L',
  MKD: 'ден',
  MNT: '₮',
  KGS: 'с',
};

const defaultPreferences: UserPreferences = {
  theme: 'light',
  currency: 'USD',
  currency_symbol: '$',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  language: 'en',
  timezone: 'UTC',
  budgetPeriod: 'monthly',
  fixedCosts: [],
  notifications: {
    transactions: true,
    budgets: true,
    reports: true,
    security: true,
  },
};

const defaultUserProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  timezone: 'UTC',
  language: 'en',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if current page is a dashboard/app page
  const isDashboardPage = () => {
    const dashboardPaths = [
      '/dashboard',
      '/transactions',
      '/insights',
      '/profile',
      '/settings',
      '/subscription',
      '/help'
    ];
    
    return dashboardPaths.some(path => location.pathname.startsWith(path)) || 
           location.pathname.startsWith('/admin');
  };

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        const merged = { ...defaultPreferences, ...parsed } as UserPreferences;

        setPreferences(merged);
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }
  }, []);

  // Load user profile from auth user metadata
  useEffect(() => {
    if (user) {
      const profile: UserProfile = {
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.user_metadata?.address || '',
        timezone: user.user_metadata?.timezone || 'UTC',
        language: user.user_metadata?.language || 'en',
      };
      setUserProfile(profile);
    }
  }, [user]);

  // Apply theme when preferences change - force light theme everywhere
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      // Force light theme globally
      root.classList.remove('dark');
      setIsDarkMode(false);
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.theme, location.pathname]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    // If currency is being updated, automatically set the currency symbol
    if (newPreferences.currency && newPreferences.currency !== preferences.currency) {
      const currencySymbol = CURRENCY_SYMBOLS[newPreferences.currency] || preferences.currency_symbol;
      newPreferences.currency_symbol = currencySymbol;
    }
    
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
  };

  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    const updatedProfile = { ...userProfile, ...newProfile };
    setUserProfile(updatedProfile);
  };

  const formatCurrency = (amount: number): string => {
    const absAmount = Math.abs(amount);
    const sign = amount >= 0 ? '' : '-';
    
    try {
      // Force English locale for currency formatting regardless of document language
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: preferences.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        numberingSystem: 'latn', // Force Latin numerals
      });

      return `${sign}${formatter.format(absAmount)}`;
    } catch (error) {
      // Fallback to simple formatting with our symbol mapping
      const symbol = CURRENCY_SYMBOLS[preferences.currency] || preferences.currency_symbol;
      return `${sign}${symbol}${absAmount.toFixed(2)}`;
    }
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (preferences.dateFormat) {
      case 'MM/DD/YYYY':
        return dateObj.toLocaleDateString('en-US');
      case 'DD/MM/YYYY':
        return dateObj.toLocaleDateString('en-GB');
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0];
      default:
        return dateObj.toLocaleDateString('en-US');
    }
  };

  const formatTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (preferences.timeFormat === '24h') {
      return dateObj.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return dateObj.toLocaleTimeString('en-US', { 
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const toggleTheme = () => {
    // Force light theme regardless of toggle
    updatePreferences({ theme: 'light' });
  };

  const shouldApplyDarkTheme = () => false;

  const value: SettingsContextType = {
    preferences,
    userProfile,
    updatePreferences,
    updateUserProfile,
    formatCurrency,
    formatDate,
    formatTime,
    isDarkMode,
    toggleTheme,
    shouldApplyDarkTheme,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
