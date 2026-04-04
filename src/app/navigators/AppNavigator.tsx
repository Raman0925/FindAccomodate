import {ComponentProps, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import {observer} from 'mobx-react-lite';
import {useRootStore} from '../providers/RootStoreProvider';
import {useAppTheme, useThemeProvider} from '../utils/useAppTheme';
import type {AppStackParamList} from './AppStackParamList';
import {DetailsScreen, WelcomeScreen} from '../screens';
import {MainTabNavigator} from './MainTabNavigator';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = observer(function AppStack() {
  const {
    theme: {colors},
  } = useAppTheme();
  const {auth} = useRootStore();

  if (!auth.hydrationComplete) {
    return (
      <View
        style={[styles.loadingRoot, {backgroundColor: colors.background}]}
      />
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {backgroundColor: colors.background},
      }}>
      {auth.isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </>
      ) : (
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      )}
    </Stack.Navigator>
  );
});

const styles = StyleSheet.create({
  loadingRoot: {flex: 1},
});

export type AppNavigationProps = Partial<
  ComponentProps<typeof NavigationContainer>
>;

export const AppNavigator = observer(function AppNavigator(
  props: AppNavigationProps,
) {
  const {onReady, ...navigationProps} = props;
  const {navigationTheme, ThemeProvider, themeScheme, setThemeContextOverride} =
    useThemeProvider();
  const {auth} = useRootStore();
  const [navigationReady, setNavigationReady] = useState(false);

  const handleReady = useCallback(() => {
    onReady?.();
    setNavigationReady(true);
  }, [onReady]);

  useEffect(() => {
    if (auth.hydrationComplete && navigationReady) {
      BootSplash.hide({fade: true}).catch(() => {});
    }
  }, [auth.hydrationComplete, navigationReady]);

  return (
    <ThemeProvider value={{themeScheme, setThemeContextOverride}}>
      <NavigationContainer
        theme={navigationTheme}
        {...navigationProps}
        onReady={handleReady}>
        <AppStack />
      </NavigationContainer>
    </ThemeProvider>
  );
});
