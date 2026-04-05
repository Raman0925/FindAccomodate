import type {Session} from '@supabase/supabase-js';
import {flow, types, type Instance, type SnapshotOut} from 'mobx-state-tree';
import {
  configureGoogleSignIn,
  isGoogleAuthConfigured,
  revokeGoogleAccessAndSignOut as revokeGoogleAccessOnDevice,
  signInWithGoogleNative,
  signOutGoogleAndSupabase,
} from '../auth/authService';
import {snapshotFromSupabaseUser} from '../auth/types';
import {supabase} from '../services/supabase/client';

const UserSnapshotModel = types.model('UserSnapshot', {
  id: types.string,
  email: types.string,
  displayName: types.maybeNull(types.string),
  photoUrl: types.maybeNull(types.string),
});

export const AuthStoreModel = types
  .model('AuthStore', {
    hydrationComplete: types.optional(types.boolean, false),
    isAuthenticated: types.optional(types.boolean, false),
    isAuthenticating: types.optional(types.boolean, false),
    userSnapshot: types.maybe(UserSnapshotModel),
    friendlyAuthError: types.maybe(types.string),
  })
  .actions(self => {
    function syncSession(session: Session | null) {
      if (!session?.user) {
        self.isAuthenticated = false;
        self.userSnapshot = undefined;
        return;
      }
      self.isAuthenticated = true;
      const snap = snapshotFromSupabaseUser(session.user);
      self.userSnapshot = {
        id: snap.id,
        email: snap.email,
        displayName: snap.displayName,
        photoUrl: snap.photoUrl,
      };
    }

    return {
      applySession(session: Session | null) {
        syncSession(session);
      },
      clearAuthError() {
        self.friendlyAuthError = undefined;
      },
      initAuth: flow(function* () {
        try {
          if (isGoogleAuthConfigured()) {
            configureGoogleSignIn();
          }
          const {data} = yield supabase.auth.getSession();
          syncSession(data.session ?? null);
        } catch {
          syncSession(null);
        } finally {
          self.hydrationComplete = true;
        }
      }),
      signInWithGoogle: flow(function* () {
        if (self.isAuthenticating) {
          return;
        }
        self.isAuthenticating = true;
        self.friendlyAuthError = undefined;
        try {
          const result = yield signInWithGoogleNative();
          if (!result.ok) {
            self.friendlyAuthError = result.error.message;
          } else {
            const {data: sessionData} = yield supabase.auth.getSession();
            syncSession(sessionData.session ?? null);
          }
        } finally {
          self.isAuthenticating = false;
        }
      }),
      signOut: flow(function* () {
        self.friendlyAuthError = undefined;
        yield signOutGoogleAndSupabase();
      }),
      revokeGoogleAccessAndSignOut: flow(function* () {
        self.friendlyAuthError = undefined;
        yield revokeGoogleAccessOnDevice();
      }),
    };
  });

export type AuthStore = Instance<typeof AuthStoreModel>;
export type AuthStoreSnapshot = SnapshotOut<typeof AuthStoreModel>;
