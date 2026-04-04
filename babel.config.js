module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Must be listed last — required for react-native-keyboard-controller + Reanimated
    'react-native-reanimated/plugin',
  ],
};
