export const SETUP_FEEDBACK_DEV_TITLE = 'Setup required';

export const SETUP_FEEDBACK_DEV_BODY =
  'Add PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, and GOOGLE_WEB_CLIENT_ID to .env.local, then restart Metro with --reset-cache.';

export const SIGN_IN_UNAVAILABLE_PROD =
  'Sign-in is temporarily unavailable. Please try again later.';

export const SETUP_FEEDBACK_PROD_SHORT = SIGN_IN_UNAVAILABLE_PROD;

export const GOOGLE_CONFIG_ERROR_PROD = SIGN_IN_UNAVAILABLE_PROD;

/** Dev-only detail when opening Google sign-in without env. */
export const GOOGLE_CONFIG_ERROR_DEV =
  'Google Sign-In is not configured. Add GOOGLE_WEB_CLIENT_ID to .env.local.';
