export const getAuthRedirectUrl = (path: string = '/dashboard') => {
  // Use environment variable for production, fallback to origin for development
  const baseUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin;
  return `${baseUrl}${path}`;
};

export const getEmailRedirectUrl = () => {
  return getAuthRedirectUrl('/dashboard');
};
