import {useCallback} from 'react';
import {isGoogleAuthConfigured} from '../auth/authService';
import {isSupabaseConfigured} from '../services/supabase/client';
import {useRootStore} from '../providers/RootStoreProvider';

export function useAuth() {
  const {auth} = useRootStore();

  const handleGoogleLogin = useCallback(() => {
    return auth.signInWithGoogle();
  }, [auth]);

  const signOut = useCallback(() => {
    return auth.signOut();
  }, [auth]);

  const revokeGoogleAccessAndSignOut = useCallback(() => {
    return auth.revokeGoogleAccessAndSignOut();
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
