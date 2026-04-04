import type {User as SupabaseUser} from '@supabase/supabase-js';

/** Snapshot-safe user fields for MST / UI (no Supabase class instances). */
export interface AuthUserSnapshot {
  id: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
}

export type AuthFlowErrorCode =
  | 'CANCELLED'
  | 'IN_PROGRESS'
  | 'PLAY_SERVICES'
  | 'NETWORK'
  | 'SUPABASE'
  | 'CONFIG'
  | 'NO_ID_TOKEN'
  | 'UNKNOWN';

/** User-safe error; never put raw provider messages in `message` for UI. */
export interface AuthFlowError {
  code: AuthFlowErrorCode;
  message: string;
}

export type GoogleSignInFlowResult =
  | {ok: true}
  | {ok: false; error: AuthFlowError};

export function snapshotFromSupabaseUser(user: SupabaseUser): AuthUserSnapshot {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const nameFromMeta = (key: string): string | null => {
    const v = meta?.[key];
    return typeof v === 'string' ? v : null;
  };
  return {
    id: user.id,
    email: user.email ?? '',
    displayName:
      nameFromMeta('full_name') ??
      nameFromMeta('name') ??
      nameFromMeta('display_name'),
    photoUrl:
      nameFromMeta('avatar_url') ??
      nameFromMeta('picture') ??
      nameFromMeta('photo_url'),
  };
}
