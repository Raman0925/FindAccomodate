import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type AppStackParamList = {
  Home: undefined;
  Details: { title?: string };
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;
