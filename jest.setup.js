import 'react-native-gesture-handler/jestSetup';

jest.mock('react-dom');

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
