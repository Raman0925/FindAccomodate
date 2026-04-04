/**
 * @format
 */

import {StatusBar, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/app/navigators';
import {RootStoreProvider} from './src/app/providers/RootStoreProvider';

function App() {
  return (
    <RootStoreProvider>
      <GestureHandlerRootView style={styles.root}>
        <KeyboardProvider>
          <SafeAreaProvider>
            <StatusBar />
            <AppNavigator />
          </SafeAreaProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </RootStoreProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {flex: 1},
});
