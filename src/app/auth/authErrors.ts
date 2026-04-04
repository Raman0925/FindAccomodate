import {
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AUTH_STORAGE_WRITE_CODE} from './secureSupabaseStorage';
import type {AuthFlowError} from './types';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function mapGoogleErrorToAuthFlowError(e: unknown): AuthFlowError {
  if (e instanceof Error && e.message === AUTH_STORAGE_WRITE_CODE) {
    return {
      code: 'UNKNOWN',
      message: 'We could not save your sign-in securely. Please try again.',
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
  }

  if (e instanceof TypeError || (isRecord(e) && e.name === 'NetworkError')) {
    return {
      code: 'NETWORK',
      message: 'Network error. Check your connection and try again.',
    };
  }

  return {
    code: 'UNKNOWN',
    message: 'Something went wrong during Google sign-in. Please try again.',
  };
}

export function mapSupabaseAuthError(_message: string): AuthFlowError {
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
