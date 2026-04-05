import {useCallback} from 'react';
import {isGoogleAuthConfigured} from '../auth/authService';
import {isSupabaseConfigured} from '../services/supabase/client';
import {useRootStore} from '../providers/RootStoreProvider';

export function useAuth() {
  const {auth} = useRootStore();

  const handleGoogleLogin = useCallback(() => {
    auth.signInWithGoogle().catch(() => {});
  }, [auth]);

  const signOut = useCallback(() => {
    auth.signOut().catch(() => {});
  }, [auth]);

  const revokeGoogleAccessAndSignOut = useCallback(() => {
    auth.revokeGoogleAccessAndSignOut().catch(() => {});
  }, [auth]);

  const clearAuthError = useCallback(() => {
    auth.clearAuthError();
  }, [auth]);

  return {
    handleGoogleLogin,
    signOut,
    revokeGoogleAccessAndSignOut,
    isAuthenticating: auth.isAuthenticating,
    friendlyError: auth.friendlyAuthError ?? null,
    clearAuthError,
    canAttemptGoogleLogin: isGoogleAuthConfigured() && isSupabaseConfigured(),
  };
}
