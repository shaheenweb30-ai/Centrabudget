# Authentication Components

This directory contains comprehensive authentication flows for CentraBudget, featuring sign up, sign in, password reset, email verification, and 2FA components.

## Components

### Layout & Core Components

1. **AuthLayout** - Shared layout with side panel visuals and responsive design
2. **OAuthButtons** - Social sign-in placeholders (Google, Apple, Microsoft)
3. **PasswordField** - Password input with show/hide toggle and accessibility
4. **StrengthMeter** - Password strength feedback with visual indicators

### Forms

5. **EmailSignUpForm** - Complete sign up form with validation
6. **EmailSignInForm** - Sign in form with security-focused error handling
7. **MagicLinkForm** - Passwordless sign-in via email
8. **PasswordResetRequest** - Request password reset link
9. **PasswordResetForm** - Set new password with strength meter
10. **VerifyEmailNotice** - Email verification notice with resend functionality
11. **TwoFactorStub** - 6-digit code input UI for 2FA

### Pages

12. **SignUpPage** - Complete sign up page with OAuth and form
13. **SignInPage** - Complete sign in page with OAuth and form
14. **ForgotPasswordPage** - Password reset request page
15. **ResetPasswordPage** - Set new password page
16. **VerifyEmailPage** - Email verification page
17. **TwoFactorPage** - 2FA verification page

## Features

- **Responsive Design**: Mobile-first with responsive layouts
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Dark Mode Support**: Compatible with existing theme system
- **Security UX**: Generic error messages for sign-in, proper validation
- **British English**: All copy uses British English spelling and terminology
- **Form Validation**: Client-side validation with proper error handling

## Usage

```tsx
import { SignUpPage, SignInPage, AuthRouterDemo } from '@/components/auth';

// Use individual pages
<SignUpPage />
<SignInPage />

// Or use the demo router to preview all flows
<AuthRouterDemo />
```

## Form Validation

### Sign Up Validation
- **Full name**: Min 2 words OR at least 2 characters
- **Email**: Required, valid format
- **Password**: Min 8 chars, at least 1 letter, 1 number
- **Confirm password**: Must match
- **Currency**: Dropdown with USD $ (default), GBP £, EUR €, AED د.إ, KWD د.ك
- **Consent**: Required checkbox for Terms and Privacy Policy
- **Marketing**: Optional checkbox (unchecked by default)

### Password Strength Rules
- **Very weak**: Score ≤ 1
- **Weak**: Score ≤ 2
- **Fair**: Score ≤ 3
- **Strong**: Score ≤ 4
- **Very strong**: Score = 5

### Security Features
- Generic error messages for sign-in (never show which field is wrong)
- Password strength meter with visual feedback
- Show/hide password toggle with proper ARIA
- Rate limiting placeholders (commented)
- 30-second cooldown for resend functionality

## Currency Options

```tsx
const CURRENCIES = [
  { code: 'USD', label: 'USD $' },
  { code: 'GBP', label: 'GBP £' },
  { code: 'EUR', label: 'EUR €' },
  { code: 'AED', label: 'AED د.إ' },
  { code: 'KWD', label: 'KWD د.ك' },
];
```

## Integration Points

### Authentication Service
Replace the TODO comments with your chosen auth service:

```tsx
// TODO: Wire to real authentication service (Supabase/Firebase/Cognito/Custom)
const handleSignUp = async (data: SignUpData) => {
  // Replace with your auth service
  const { user, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        currency: data.currency,
        marketing_opt_in: data.marketingOptIn
      }
    }
  });
};
```

### Routing Flows
- SignUp success → /verify-email
- SignIn success:
  - if requires 2FA → /two-factor
  - else → /app (dashboard)
- MagicLink success → show notice; clicking link → /app
- ForgotPassword → success notice
- ResetPassword → on success redirect to SignIn with toast "Password updated"
- Resend verify → disable for 30s (simple timer)

## File Structure

```
src/components/auth/
├── index.ts                    # Exports all components
├── AuthLayout.tsx              # Shared layout + side panel
├── OAuthButtons.tsx            # Social sign-in placeholders
├── PasswordField.tsx           # Password input with toggle
├── StrengthMeter.tsx           # Password strength feedback
├── EmailSignUpForm.tsx         # Sign up form
├── EmailSignInForm.tsx         # Sign in form
├── MagicLinkForm.tsx           # Passwordless sign-in
├── PasswordResetRequest.tsx    # Request reset link
├── PasswordResetForm.tsx       # Set new password
├── VerifyEmailNotice.tsx       # Email verification
├── TwoFactorStub.tsx           # 2FA code input
├── SignUpPage.tsx              # Complete sign up page
├── SignInPage.tsx              # Complete sign in page
├── ForgotPasswordPage.tsx      # Password reset request page
├── ResetPasswordPage.tsx       # Set new password page
├── VerifyEmailPage.tsx         # Email verification page
├── TwoFactorPage.tsx           # 2FA verification page
├── AuthRouterDemo.tsx          # Demo router for preview
└── README.md                   # This file
```

## Demo

Use the `AuthRouterDemo` component to preview all authentication flows:

```tsx
import { AuthRouterDemo } from '@/components/auth';

// Shows navigation buttons to switch between all auth pages
<AuthRouterDemo />
```

## Accessibility

- All inputs have proper labels and ARIA attributes
- Error messages are announced to screen readers
- Keyboard navigation is fully supported
- Focus management moves to first error on form submission
- Password strength meter has proper ARIA roles
- OAuth buttons have tooltips for disabled state

## Styling

All components use Tailwind CSS classes and follow the design system:
- Primary color: Deep blue
- Success color: Soft green
- AI moments: Subtle purple
- Generous whitespace and rounded corners
- Dark mode compatible
