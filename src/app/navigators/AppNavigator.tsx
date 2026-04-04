import {ComponentProps} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppTheme, useThemeProvider} from '../utils/useAppTheme';
import type {AppStackParamList} from './AppStackParamList';
import {HomeScreen, DetailsScreen} from '../screens';

const Stack = createNativeStackNavigator<AppStackParamList>();

function AppStack() {
  const {
    theme: {colors},
  } = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export type AppNavigationProps = Partial<
  ComponentProps<typeof NavigationContainer>
>;

export function AppNavigator(props: AppNavigationProps) {
  const {navigationTheme, ThemeProvider, themeScheme, setThemeContextOverride} =
    useThemeProvider();

  return (
    <ThemeProvider value={{themeScheme, setThemeContextOverride}}>
      <NavigationContainer theme={navigationTheme} {...props}>
        <AppStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}
