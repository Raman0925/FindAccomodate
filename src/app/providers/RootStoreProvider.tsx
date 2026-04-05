import {createContext, useContext, useEffect, type ReactNode} from 'react';
import {rootStore, type RootStore} from '../models/RootStore';
import {supabase} from '../services/supabase/client';

const RootStoreContext = createContext<RootStore | null>(null);

export function RootStoreProvider({children}: {children: ReactNode}) {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    rootStore.auth
      .initAuth()
      .then(() => {
        const {data} = supabase.auth.onAuthStateChange((_event, session) => {
          rootStore.auth.applySession(session);
        });
        unsubscribe = () => {
          data.subscription.unsubscribe();
        };
      })
      .catch(() => {});

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  );
}

export function useRootStore(): RootStore {
  const ctx = useContext(RootStoreContext);
  if (!ctx) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }
  return ctx;
}
