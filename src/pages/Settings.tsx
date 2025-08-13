import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  Palette, 
  Globe, 
  CreditCard,
  Download,
  Trash2,
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Shield,
  ChevronDown,
  Plus
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("preferences");
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savedStates, setSavedStates] = useState({
    preferences: false
  });
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { preferences, updatePreferences } = useSettings();

  // Safety check - ensure preferences exist
  if (!preferences) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Loading Settings</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Please wait while we load your settings...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }



  const [preferencesForm, setPreferencesForm] = useState({
    currency: preferences?.currency || 'USD',
    budgetPeriod: (preferences?.budgetPeriod ?? 'monthly') as 'monthly' | 'quarterly' | 'yearly',
    dateFormat: preferences?.dateFormat || 'MM/DD/YYYY',
    timeFormat: preferences?.timeFormat || '12h' as '12h' | '24h'
  });

  const [currencySearchTerm, setCurrencySearchTerm] = useState("");
  
  // Comprehensive list of world currencies
  const allCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
    { code: 'UYU', name: 'Uruguayan Peso', symbol: '$' },
    { code: 'PYG', name: 'Paraguayan Guaraní', symbol: '₲' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'TND' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'QAR' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KWD' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BHD' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'OMR' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JOD' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr' },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
    { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
    { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
    { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
    { code: 'UZS', name: 'Uzbekistani Som', symbol: 'so\'m' },
    { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с' },
    { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'ЅМ' },
    { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T' },
    { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼' },
    { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
    { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
    { code: 'BAM', name: 'Bosnia and Herzegovina Convertible Mark', symbol: 'KM' },
    { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден' },
    { code: 'ALL', name: 'Albanian Lek', symbol: 'L' },
    { code: 'MDL', name: 'Moldovan Leu', symbol: 'L' },
    { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' },
    { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' },
    { code: 'XPF', name: 'CFP Franc', symbol: 'CFP' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ' },
    { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ' },
    { code: 'BBD', name: 'Barbadian Dollar', symbol: '$' },
    { code: 'BMD', name: 'Bermudian Dollar', symbol: '$' },
    { code: 'BND', name: 'Brunei Dollar', symbol: '$' },
    { code: 'BSD', name: 'Bahamian Dollar', symbol: '$' },
    { code: 'FJD', name: 'Fijian Dollar', symbol: '$' },
    { code: 'GYD', name: 'Guyanese Dollar', symbol: '$' },
    { code: 'JMD', name: 'Jamaican Dollar', symbol: '$' },
    { code: 'LRD', name: 'Liberian Dollar', symbol: '$' },
    { code: 'NAD', name: 'Namibian Dollar', symbol: '$' },
    { code: 'SBD', name: 'Solomon Islands Dollar', symbol: '$' },
    { code: 'SRD', name: 'Surinamese Dollar', symbol: '$' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: '$' },
    { code: 'TVD', name: 'Tuvaluan Dollar', symbol: '$' },
    { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: '$' }
  ];

  // Handle tab parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['preferences', 'billing', 'admin'].includes(tabParam)) {
      setActiveTab(tabParam as 'preferences' | 'billing' | 'admin');
    } else if (tabParam && tabParam === 'profile') {
      // Redirect invalid profile tab to preferences
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('tab', 'preferences');
      window.history.replaceState({}, '', newUrl.toString());
      setActiveTab('preferences');
    }
  }, []);

  // Load user preferences
  useEffect(() => {
    try {
      if (preferences) {
        setPreferencesForm({
          currency: preferences.currency || 'USD',
          budgetPeriod: preferences.budgetPeriod || 'monthly',
          dateFormat: preferences.dateFormat || 'MM/DD/YYYY',
          timeFormat: preferences.timeFormat || '12h'
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      // Set default values if there's an error
      setPreferencesForm({
        currency: 'USD',
        budgetPeriod: 'monthly',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      });
    }
  }, [preferences]);



  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPreferences(true);
    
    try {
      // Update the context with new preferences
      updatePreferences({
        theme: 'light', // Always light theme
        currency: preferencesForm.currency,
        budgetPeriod: preferencesForm.budgetPeriod,
        dateFormat: preferencesForm.dateFormat,
        timeFormat: preferencesForm.timeFormat,
        notifications: {
          transactions: false,
          budgets: false,
          reports: false,
          security: false
        }
      });

      setSavedStates(prev => ({ ...prev, preferences: true }));
      toast({
        title: "Preferences Updated! ✨",
        description: "Your preferences have been saved successfully.",
      });

      // Reset saved state after 3 seconds
      setTimeout(() => {
        setSavedStates(prev => ({ ...prev, preferences: false }));
      }, 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPreferences(false);
    }
  };



  const filteredCurrencies = allCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(currencySearchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(currencySearchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Not Authenticated</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Please log in to access settings.</p>
              <Button onClick={() => navigate('/login')} className="rounded-full">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  try {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                Application Settings
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
                Settings & Preferences
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Customize your experience and manage your account</p>
            </div>

          {/* Settings Tabs */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 dark:bg-slate-700/50 p-1 rounded-lg m-6">
                  <TabsTrigger value="preferences" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <Palette className="w-4 h-4 mr-2" />
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </TabsTrigger>
                </TabsList>





                {/* Preferences Tab */}
                <TabsContent value="preferences" className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">App Preferences</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Customize your app appearance and behavior</p>
                    </div>
                    {savedStates.preferences && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Saved!
                      </Badge>
                    )}
                  </div>

                  <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-700 dark:text-slate-300">Appearance</h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <div className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 dark:text-slate-200">
                              Light (Fixed)
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <div className="relative">
                              <select
                                id="currency"
                                value={preferencesForm.currency}
                                onChange={(e) => setPreferencesForm(prev => ({ ...prev, currency: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                              >
                                {filteredCurrencies.map((currency) => (
                                  <option key={currency.code} value={currency.code}>
                                    {currency.code} - {currency.name} ({currency.symbol})
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-700 dark:text-slate-300">Formatting</h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="budgetPeriod">Budget Period</Label>
                            <select
                              id="budgetPeriod"
                              value={preferencesForm.budgetPeriod}
                              onChange={(e) => setPreferencesForm(prev => ({ ...prev, budgetPeriod: e.target.value as 'monthly' | 'quarterly' | 'yearly' }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="timeFormat">Time Format</Label>
                            <select
                              id="timeFormat"
                              value={preferencesForm.timeFormat}
                              onChange={(e) => setPreferencesForm(prev => ({ ...prev, timeFormat: e.target.value as '12h' | '24h' }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            >
                              <option value="12h">12-hour (AM/PM)</option>
                              <option value="24h">24-hour</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>



                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={savingPreferences}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {savingPreferences ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Preferences
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Billing & Subscription</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Manage your subscription and billing information</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                          Current Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Plan</span>
                            <span className="font-medium">Free Tier</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Active
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <Download className="w-4 h-4 mr-2 text-green-600" />
                          Usage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Transactions</span>
                            <span className="font-medium">Unlimited</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Storage</span>
                            <span className="font-medium">1GB</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                </TabsContent>

                {/* Admin Tab */}
                <TabsContent value="admin" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Administrative Settings</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Advanced settings and account management</p>
                  </div>

                  <div className="space-y-4">
                    <Card className="border-0 bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center text-red-700 dark:text-red-300">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Danger Zone
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Account Management</h4>
                            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                              Manage your account settings and preferences.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>


        </div>
      </div>
    </DashboardLayout>
  );
  } catch (error) {
    console.error('Settings page error:', error);
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">Settings Error</h3>
              <p className="text-red-600 dark:text-red-400 mb-4">There was an error loading the settings page. Please try refreshing.</p>
              <Button onClick={() => window.location.reload()} className="rounded-full">
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}