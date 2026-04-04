import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';
import {HomeScreen} from '../screens/HomeScreen';
import {useAppTheme} from '../utils/useAppTheme';
import {ExploreScreen} from '../screens';
import type {MainTabParamList} from './MainTabParamList';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const {theme} = useAppTheme();
  const active = theme.colors.palette.tabBarActiveColor;
  const inactive = theme.colors.inactiveIcon;

  const tabIcon = (focused: boolean) => (
    <View
      style={[styles.tabDot, {backgroundColor: focused ? active : inactive}]}
    />
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.bricolage.medium,
          fontSize: 12,
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({focused}) => tabIcon(focused),
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({focused}) => tabIcon(focused),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
