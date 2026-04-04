import {createContext, useContext, useEffect, type ReactNode} from 'react';
import {rootStore, type RootStore} from '../models/RootStore';

const RootStoreContext = createContext<RootStore | null>(null);

export function RootStoreProvider({children}: {children: ReactNode}) {
  useEffect(() => {
    rootStore.auth.initAuth();
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
