/**
 * @format
 */

import React from 'react';
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {RootStoreProvider} from './src/app/providers/RootStoreProvider';
import {name as appName} from './app.json';

/** Wrap at entry so hooks like `useRootStore` always have context (even if `App.tsx` is refactored). */
function AccoNetworkRoot() {
  return React.createElement(
    RootStoreProvider,
    null,
    React.createElement(App, null),
  );
}

AppRegistry.registerComponent(appName, () => AccoNetworkRoot);
