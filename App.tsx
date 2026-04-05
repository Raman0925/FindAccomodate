/**
 * @format
 */

import {StatusBar, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/app/navigators';

import {GluestackUIProvider} from './src/components/ui/gluestack-ui-provider';
import './global.css';

function App() {
  return (
    <GluestackUIProvider mode="dark">
      <GestureHandlerRootView style={styles.root}>
        <KeyboardProvider>
          <SafeAreaProvider>
            <StatusBar />
            <AppNavigator />
          </SafeAreaProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {flex: 1},
});
