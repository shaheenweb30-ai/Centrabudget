import { useState, useEffect } from 'react';

interface OnboardingState {
  isNewUser: boolean;
  welcomeShown: boolean;
  shouldShowWelcome: boolean;
  markWelcomeShown: () => void;
  markAsReturningUser: () => void;
  resetWelcomeState: () => void;
}

export const useOnboarding = (): OnboardingState => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [shouldShowWelcome, setShouldShowWelcome] = useState(false);

  useEffect(() => {
    // Check localStorage for onboarding state
    try {
      const newUserFlag = localStorage.getItem('centrabudget_newUser') === 'true';
      const welcomeShownFlag = localStorage.getItem('centrabudget_welcomeShown') === 'true';
      
      // If no onboarding state exists, treat as new user
      const isFirstTimeUser = localStorage.getItem('centrabudget_newUser') === null && 
                             localStorage.getItem('centrabudget_welcomeShown') === null;
      
      setIsNewUser(newUserFlag || isFirstTimeUser);
      setWelcomeShown(welcomeShownFlag);
      
      // Show welcome for new users who haven't seen it yet
      // Also show for first-time users
      setShouldShowWelcome((newUserFlag || isFirstTimeUser) && !welcomeShownFlag);
      
      // If this is a first-time user, set the flag
      if (isFirstTimeUser) {
        localStorage.setItem('centrabudget_newUser', 'true');
      }
    } catch (error) {
      console.warn('Failed to read onboarding state from localStorage:', error);
      // Default to showing welcome if localStorage fails
      setShouldShowWelcome(true);
      setIsNewUser(true);
    }
  }, []);

  const markWelcomeShown = () => {
    try {
      localStorage.setItem('centrabudget_welcomeShown', 'true');
      setWelcomeShown(true);
      setShouldShowWelcome(false);
    } catch (error) {
      console.warn('Failed to save welcome shown state:', error);
    }
  };

  const markAsReturningUser = () => {
    try {
      localStorage.removeItem('centrabudget_newUser');
      localStorage.setItem('centrabudget_welcomeShown', 'true');
      setIsNewUser(false);
      setWelcomeShown(true);
      setShouldShowWelcome(false);
    } catch (error) {
      console.warn('Failed to update user state:', error);
    }
  };

  const resetWelcomeState = () => {
    try {
      localStorage.removeItem('centrabudget_welcomeShown');
      setWelcomeShown(false);
      setShouldShowWelcome(true);
    } catch (error) {
      console.warn('Failed to reset welcome state:', error);
    }
  };

  return {
    isNewUser,
    welcomeShown,
    shouldShowWelcome,
    markWelcomeShown,
    markAsReturningUser,
    resetWelcomeState,
  };
};
