import 'react-native-gesture-handler/jestSetup';

jest.mock('@/components/ui/gluestack-ui-provider', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    GluestackUIProvider: ({children, style, ...rest}) =>
      React.createElement(View, {style: [{flex: 1}, style], ...rest}, children),
  };
});

jest.mock('./src/app/services/supabase/client', () => {
  const subscription = {unsubscribe: jest.fn()};
  return {
    supabase: {
      auth: {
        getSession: jest.fn(() =>
          Promise.resolve({data: {session: null}, error: null}),
        ),
        onAuthStateChange: jest.fn(() => ({
          data: {subscription},
        })),
        signInWithIdToken: jest.fn(() =>
          Promise.resolve({data: {session: null}, error: null}),
        ),
        signOut: jest.fn(() => Promise.resolve({error: null})),
        startAutoRefresh: jest.fn(),
        stopAutoRefresh: jest.fn(),
      },
    },
    isSupabaseConfigured: () => true,
  };
});

jest.mock('react-dom');

jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
  },
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  setGenericPassword: jest.fn(() =>
    Promise.resolve({service: 'test', storage: 'test'}),
  ),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() =>
      Promise.resolve({
        type: 'success',
        data: {
          user: {
            id: '1',
            name: 'Test',
            email: 't@test.com',
            photo: null,
            familyName: null,
            givenName: null,
          },
          scopes: [],
          idToken: 'mock-id-token',
          serverAuthCode: null,
        },
      }),
    ),
    getTokens: jest.fn(() =>
      Promise.resolve({
        idToken: 'mock-id-token',
        accessToken: 'mock-access-token',
      }),
    ),
    signOut: jest.fn(() => Promise.resolve(null)),
    revokeAccess: jest.fn(() => Promise.resolve(null)),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
  },
  isErrorWithCode: jest.fn(
    e => typeof e === 'object' && e !== null && 'code' in e,
  ),
}));

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(() => Promise.resolve()),
  isVisible: jest.fn(() => Promise.resolve(false)),
  useHideAnimation: jest.fn(),
}));

// In-memory MMKV for Jest (same API surface as react-native-mmkv)
jest.mock('react-native-mmkv', () => {
  const store = new Map();
  class MMKV {
    getString(key) {
      const v = store.get(key);
      return typeof v === 'string' ? v : undefined;
    }
    getBoolean(key) {
      const v = store.get(key);
      return typeof v === 'boolean' ? v : undefined;
    }
    set(key, value) {
      store.set(key, value);
    }
    delete(key) {
      store.delete(key);
    }
    clearAll() {
      store.clear();
    }
    getAllKeys() {
      return Array.from(store.keys());
    }
  }
  return {MMKV};
});

jest.mock('react-native-keyboard-controller', () => {
  const {
    View,
    ScrollView,
    KeyboardAvoidingView: RNKAV,
  } = require('react-native');
  return {
    KeyboardProvider: ({children}) => children,
    KeyboardAvoidingView: RNKAV,
    KeyboardAwareScrollView: ScrollView,
    KeyboardStickyView: View,
    KeyboardToolbar: View,
    useKeyboardHandler: () => {},
    useReanimatedKeyboardAnimation: () => ({
      height: {value: 0},
      progress: {value: 0},
    }),
  };
});
