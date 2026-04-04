import * as Keychain from 'react-native-keychain';
import {logInfo} from '../services/api/logger';

const SERVICE = 'com.acconetwork.supabase.auth.session.v1';

/** Safe diagnostics only: phases, counts, key *names* — never values, tokens, or raw `Error.message`. */
type StorageFailureContext = {
  phase?: string;
  /** Supabase auth storage entry name (not the secret payload). */
  supabaseStorageKey?: string;
  bundleKeyCountBefore?: number;
  bundleKeyCountAfter?: number;
  hadKey?: boolean;
};

function logStorageFailure(
  operation: string,
  context?: StorageFailureContext,
): void {
  logInfo('Secure auth storage', {
    operation,
    outcome: 'failed',
    ...context,
  });
}

async function readBundle(): Promise<Record<string, string>> {
  try {
    const creds = await Keychain.getGenericPassword({service: SERVICE});
    if (!creds || typeof creds.password !== 'string') {
      return {};
    }
    try {
      const parsed: unknown = JSON.parse(creds.password);
      if (!parsed || typeof parsed !== 'object') {
        return {};
      }
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        if (typeof v === 'string') {
          out[k] = v;
        }
      }
      return out;
    } catch {
      logStorageFailure('parse_bundle', {
        phase: 'json_parse_or_shape',
      });
      return {};
    }
  } catch {
    logStorageFailure('read_bundle', {
      phase: 'keychain_get_generic_password',
    });
    return {};
  }
}

/** Opaque failure code — match in `authErrors` only; never show raw OS/Keystore messages to users. */
export const AUTH_STORAGE_WRITE_CODE = 'AUTH_STORAGE_WRITE';

async function writeBundle(bundle: Record<string, string>): Promise<void> {
  try {
    const payload = JSON.stringify(bundle);
    const result = await Keychain.setGenericPassword('supabase', payload, {
      service: SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    if (result === false) {
      logStorageFailure('write_bundle', {
        phase: 'set_generic_password_returned_false',
        bundleKeyCountAfter: Object.keys(bundle).length,
      });
      throw new Error(AUTH_STORAGE_WRITE_CODE);
    }
  } catch (e) {
    if (e instanceof Error && e.message === AUTH_STORAGE_WRITE_CODE) {
      throw e;
    }
    logStorageFailure('write_bundle', {
      phase: 'set_generic_password_threw',
      bundleKeyCountAfter: Object.keys(bundle).length,
    });
    throw new Error(AUTH_STORAGE_WRITE_CODE);
  }
}

/**
 * Supabase Auth v2 adapter: one encrypted credential holds a JSON map of Supabase auth keys.
 * Reads/removes fail soft; writes throw only an opaque code (handled by auth UI as a generic failure).
 */
export const supabaseSecureAuthStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const bundle = await readBundle();
    return bundle[key] ?? null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    const bundle = await readBundle();
    bundle[key] = value;
    await writeBundle(bundle);
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      const bundle = await readBundle();
      const bundleKeyCountBefore = Object.keys(bundle).length;
      const hadKey = Object.prototype.hasOwnProperty.call(bundle, key);
      delete bundle[key];
      const bundleKeyCountAfter = Object.keys(bundle).length;

      if (bundleKeyCountAfter === 0) {
        try {
          const resetOk = await Keychain.resetGenericPassword({
            service: SERVICE,
          });
          if (!resetOk) {
            logStorageFailure('removeItem', {
              phase: 'keychain_reset_empty_bundle_returned_false',
              supabaseStorageKey: key,
              bundleKeyCountBefore,
              bundleKeyCountAfter: 0,
              hadKey,
            });
          }
        } catch {
          logStorageFailure('removeItem', {
            phase: 'keychain_reset_empty_bundle_threw',
            supabaseStorageKey: key,
            bundleKeyCountBefore,
            bundleKeyCountAfter: 0,
            hadKey,
          });
        }
        return;
      }

      try {
        await writeBundle(bundle);
      } catch {
        logStorageFailure('removeItem', {
          phase: 'persist_shrunk_bundle_after_delete',
          supabaseStorageKey: key,
          bundleKeyCountBefore,
          bundleKeyCountAfter,
          hadKey,
        });
      }
    } catch {
      logStorageFailure('removeItem', {
        phase: 'unexpected_outer',
        supabaseStorageKey: key,
      });
    }
  },
};
