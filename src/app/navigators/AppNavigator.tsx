import {ComponentProps, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import {useAppTheme, useThemeProvider} from '../utils/useAppTheme';
import type {AppStackParamList} from './AppStackParamList';
import {DetailsScreen} from '../screens';
import {MainTabNavigator} from './MainTabNavigator';

const Stack = createNativeStackNavigator<AppStackParamList>();

function AppStack() {
  const {
    theme: {colors},
  } = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export type AppNavigationProps = Partial<
  ComponentProps<typeof NavigationContainer>
>;

export function AppNavigator(props: AppNavigationProps) {
  const {onReady, ...navigationProps} = props;
  const {navigationTheme, ThemeProvider, themeScheme, setThemeContextOverride} =
    useThemeProvider();

  const handleReady = useCallback(() => {
    onReady?.();
    BootSplash.hide({fade: true}).catch(() => {});
  }, [onReady]);

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
}
