import { supabase } from '@/integrations/supabase/client';

export const getAuthRedirectUrl = (path: string = '/dashboard') => {
  // Use environment variable for production, fallback to origin for development
  const baseUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin;
  return `${baseUrl}${path}`;
};

export const getEmailRedirectUrl = (path: string = '/dashboard') => {
  return getAuthRedirectUrl(path);
};

/**
 * Robust logout function that handles various logout scenarios
 * including 403 Forbidden errors from Supabase
 */
export const robustLogout = async (): Promise<void> => {
  console.log('🔄 Starting robust logout process...');
  
  try {
    // First, check current session status
    const { data: { session } } = await supabase.auth.getSession();
    console.log('📋 Current session status:', session ? 'Active' : 'None');
    
    if (session) {
      console.log('👤 User ID:', session.user.id);
      console.log('📅 Session expires at:', new Date(session.expires_at! * 1000).toISOString());
    }
    
    // First, try the normal Supabase logout
    console.log('🚪 Attempting normal Supabase logout...');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.warn('⚠️ Supabase logout returned error:', error);
      console.warn('📝 Error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      
      // If it's a 403 Forbidden error, try alternative approaches
      if (error.message?.includes('403') || error.message?.includes('Forbidden') || error.status === 403) {
        console.log('🚨 Handling 403 Forbidden error during logout');
        
        // Try local logout as fallback
        try {
          console.log('🔄 Attempting local logout as fallback...');
          await supabase.auth.signOut({ scope: 'local' });
          console.log('✅ Local logout successful');
        } catch (localError) {
          console.warn('⚠️ Local logout also failed:', localError);
        }
        
        // Also try to clear the session directly
        try {
          console.log('🔄 Attempting to clear session directly...');
          await supabase.auth.setSession(null);
          console.log('✅ Session cleared directly');
        } catch (sessionError) {
          console.warn('⚠️ Direct session clear failed:', sessionError);
        }
      }
    } else {
      console.log('✅ Normal Supabase logout successful');
    }
  } catch (logoutError) {
    console.warn('⚠️ Error during Supabase logout:', logoutError);
    
    // Try local logout as fallback
    try {
      console.log('🔄 Attempting local logout as fallback...');
      await supabase.auth.signOut({ scope: 'local' });
      console.log('✅ Local logout successful');
    } catch (localError) {
      console.warn('⚠️ Local logout also failed:', localError);
    }
  }
  
  // Always clear local storage and session storage
  console.log('🧹 Clearing authentication storage...');
  clearAuthStorage();
  
  // Clear any remaining Supabase state
  try {
    console.log('🔄 Clearing remaining Supabase state...');
    // Force clear the auth state
    await supabase.auth.setSession(null);
    console.log('✅ Supabase state cleared');
  } catch (clearError) {
    console.warn('⚠️ Error clearing session:', clearError);
  }
  
  // Additional aggressive cleanup for 403 errors
  try {
    console.log('🔄 Performing additional cleanup...');
    
    // Clear cookies more aggressively
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear any remaining localStorage items
    const remainingKeys = Object.keys(localStorage);
    remainingKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ Additional cleanup completed');
  } catch (cleanupError) {
    console.warn('⚠️ Error during additional cleanup:', cleanupError);
  }
  
  console.log('✅ Robust logout process completed');
};

/**
 * Clear all authentication-related storage
 */
export const clearAuthStorage = (): void => {
  try {
    // Clear localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear specific known keys
    localStorage.removeItem('sb-rjjflvdxomgyxqgdsewk-auth-token');
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('sb-rjjflvdxomgyxqgdsewk-auth-token');
    sessionStorage.removeItem('supabase.auth.token');
    
    console.log('🧹 Cleared all authentication storage');
  } catch (error) {
    console.warn('Error clearing storage:', error);
  }
};

/**
 * Force logout by clearing all data and redirecting
 * Use this as a last resort when normal logout fails
 */
export const forceLogout = (): void => {
  try {
    // Clear all storage
    clearAuthStorage();
    
    // Clear cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('🚨 Force logout completed');
  } catch (error) {
    console.warn('Error during force logout:', error);
  }
};

/**
 * Emergency logout for corrupted sessions
 * Completely bypasses Supabase and forces a clean state
 */
export const emergencyLogout = async (): Promise<void> => {
  console.log('🚨 Starting emergency logout...');
  
  try {
    // Clear all storage immediately
    clearAuthStorage();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear session storage completely
    sessionStorage.clear();
    
    // Try to clear Supabase state without API calls
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (e) {
      console.warn('Local signout failed during emergency logout:', e);
    }
    
    console.log('✅ Emergency logout completed');
  } catch (error) {
    console.error('Critical error during emergency logout:', error);
    // Even on error, try to clear as much as possible
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage during emergency logout:', e);
    }
  }
};
