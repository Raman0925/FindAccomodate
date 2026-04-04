import {Platform} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import type {ConfigureParams} from '@react-native-google-signin/google-signin';
import {GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID} from '@env';
import {
  GOOGLE_CONFIG_ERROR_DEV,
  GOOGLE_CONFIG_ERROR_PROD,
} from '../config/authSetupFeedback';
import {supabase} from '../services/supabase/client';
import {
  mapConfigError,
  mapGoogleErrorToAuthFlowError,
  mapNoIdTokenError,
  mapSupabaseAuthError,
} from './authErrors';
import type {GoogleSignInFlowResult} from './types';

let googleConfigured = false;

export function isGoogleAuthConfigured(): boolean {
  return Boolean(GOOGLE_WEB_CLIENT_ID?.trim());
}

export function configureGoogleSignIn(): void {
  if (googleConfigured) {
    return;
  }
  const webClientId = GOOGLE_WEB_CLIENT_ID?.trim();
  if (!webClientId) {
    return;
  }
  const ios = GOOGLE_IOS_CLIENT_ID?.trim();
  const params = {
    webClientId,
    offlineAccess: true,
    forceCodeForRefreshToken: false,
    ...(ios ? {iosClientId: ios} : {}),
  } as ConfigureParams;
  GoogleSignin.configure(params);
  googleConfigured = true;
}

/**
 * Native Google Sign-In (RFC 8252) + Supabase `signInWithIdToken` using OIDC `idToken`.
 * No WebView; no client secrets in the app.
 */
export async function signInWithGoogleNative(): Promise<GoogleSignInFlowResult> {
  if (!isGoogleAuthConfigured()) {
    return {
      ok: false,
      error: mapConfigError(
        __DEV__ ? GOOGLE_CONFIG_ERROR_DEV : GOOGLE_CONFIG_ERROR_PROD,
      ),
    };
  }

  configureGoogleSignIn();

  try {
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    }

    const response = await GoogleSignin.signIn();
    if (response.type !== 'success') {
      return {
        ok: false,
        error: {
          code: 'CANCELLED',
          message: 'Sign-in was cancelled.',
        },
      };
    }

    const tokens = await GoogleSignin.getTokens();
    const idToken = tokens.idToken;
    if (!idToken) {
      return {ok: false, error: mapNoIdTokenError()};
    }

    const {error} = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
      access_token: tokens.accessToken,
    });

    if (error) {
      return {
        ok: false,
        error: mapSupabaseAuthError(error.message),
      };
    }

    return {ok: true};
  } catch (e: unknown) {
    return {ok: false, error: mapGoogleErrorToAuthFlowError(e)};
  }
}

/** Standard logout: clears Google session locally; does not revoke consent server-side. */
export async function signOutGoogleAndSupabase(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    /* ignore */
  }
  await supabase.auth.signOut();
}

/**
 * Account removal / disconnect: revokes this app's access to the Google account.
 * User must re-consent on next sign-in. Then signs out of Supabase.
 */
export async function revokeGoogleAccessAndSignOut(): Promise<void> {
  try {
    await GoogleSignin.revokeAccess();
  } catch {
    /* ignore */
  }
  await supabase.auth.signOut();
}
