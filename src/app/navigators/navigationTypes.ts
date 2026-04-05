import type {CompositeNavigationProp} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AppStackParamList} from './AppStackParamList';
import type {MainTabParamList} from './MainTabParamList';

/** Use on screens inside `MainTabNavigator` when navigating to root stack routes. */
export type MainTabsCompositeNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, keyof MainTabParamList>,
  NativeStackNavigationProp<AppStackParamList>
>;
