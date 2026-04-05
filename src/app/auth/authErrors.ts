import {
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AUTH_STORAGE_WRITE_CODE} from './secureSupabaseStorage';
import type {AuthFlowError} from './types';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Thrown by @supabase/auth-js when a call fails outside the `{ data, error }` path. */
export function isSupabaseAuthThrownError(
  e: unknown,
): e is {message: string; name?: string} {
  return (
    typeof e === 'object' &&
    e !== null &&
    '__isAuthError' in e &&
    typeof (e as {message?: unknown}).message === 'string'
  );
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }
  if (typeof e === 'string') {
    return e;
  }
  if (isRecord(e) && typeof e.message === 'string') {
    return e.message;
  }
  return '';
}

/** Android ApiException 10 / DEVELOPER_ERROR — wrong SHA-1, package name, or OAuth client. */
function isGoogleDeveloperMisconfig(e: unknown): boolean {
  const m = errorMessage(e);
  return /DEVELOPER_ERROR|ApiException:\s*10|code:\s*10\b/i.test(m);
}

export function mapGoogleErrorToAuthFlowError(e: unknown): AuthFlowError {
  if (e instanceof Error && e.message === AUTH_STORAGE_WRITE_CODE) {
    return {
      code: 'UNKNOWN',
      message: 'We could not save your sign-in securely. Please try again.',
    };
  }

  if (isGoogleDeveloperMisconfig(e)) {
    return {
      code: 'CONFIG',
      message: __DEV__
        ? 'Google Sign-In setup error: add your debug/release SHA-1 and package name to the Android OAuth client in Google Cloud, and ensure GOOGLE_WEB_CLIENT_ID matches the Web client.'
        : 'Sign-in could not be completed. Please try again later.',
    };
  }

  if (isErrorWithCode(e)) {
    if (e.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        code: 'CANCELLED',
        message: 'Sign-in was cancelled.',
      };
    }
    if (e.code === statusCodes.IN_PROGRESS) {
      return {
        code: 'IN_PROGRESS',
        message: 'Sign-in is already in progress. Please wait.',
      };
    }
    if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        code: 'PLAY_SERVICES',
        message: 'Google Play services are not available or need an update.',
      };
    }
    if (e.code === statusCodes.SIGN_IN_REQUIRED) {
      return {
        code: 'UNKNOWN',
        message: 'Please sign in with Google again.',
      };
    }
    if (e.code === statusCodes.NULL_PRESENTER) {
      return {
        code: 'UNKNOWN',
        message: 'Could not open Google sign-in. Try again or restart the app.',
      };
    }
    if (__DEV__) {
      return {
        code: 'UNKNOWN',
        message: `Google Sign-In (dev): ${e.message || 'unknown'} [code: ${String(e.code)}]`,
      };
    }
  }

  if (e instanceof TypeError || (isRecord(e) && e.name === 'NetworkError')) {
    return {
      code: 'NETWORK',
      message: 'Network error. Check your connection and try again.',
    };
  }

  const fallbackMsg = errorMessage(e);
  if (__DEV__ && fallbackMsg.length > 0) {
    return {
      code: 'UNKNOWN',
      message: `Sign-in failed (dev): ${fallbackMsg}`,
    };
  }

  return {
    code: 'UNKNOWN',
    message: 'Something went wrong during Google sign-in. Please try again.',
  };
}

export function mapSupabaseAuthError(message: string): AuthFlowError {
  if (__DEV__ && message.trim().length > 0) {
    return {
      code: 'SUPABASE',
      message: `Sign-in failed (dev): ${message}`,
    };
  }
  return {
    code: 'SUPABASE',
    message: 'We could not finish signing you in. Please try again.',
  };
}

export function mapConfigError(detail: string): AuthFlowError {
  return {
    code: 'CONFIG',
    message: detail,
  };
}

export function mapNoIdTokenError(): AuthFlowError {
  return {
    code: 'NO_ID_TOKEN',
    message: 'Could not obtain a secure sign-in token from Google.',
  };
}
