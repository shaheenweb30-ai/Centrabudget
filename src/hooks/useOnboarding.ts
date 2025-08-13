import { useState, useEffect } from 'react';

interface OnboardingState {
  isNewUser: boolean;
  welcomeShown: boolean;
  shouldShowWelcome: boolean;
  markWelcomeShown: () => void;
  markAsReturningUser: () => void;
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
      
      setIsNewUser(newUserFlag);
      setWelcomeShown(welcomeShownFlag);
      
      // Show welcome if user is new and welcome hasn't been shown
      setShouldShowWelcome(newUserFlag && !welcomeShownFlag);
    } catch (error) {
      console.warn('Failed to read onboarding state from localStorage:', error);
      // Default to not showing welcome if localStorage fails
      setShouldShowWelcome(false);
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

  return {
    isNewUser,
    welcomeShown,
    shouldShowWelcome,
    markWelcomeShown,
    markAsReturningUser,
  };
};
