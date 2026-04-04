import 'react-native-gesture-handler/jestSetup';

jest.mock('react-dom');

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
