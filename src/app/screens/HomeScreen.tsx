import {Pressable, Text, View, type ViewStyle} from 'react-native';
import type {Theme} from '../theme';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Screen} from '../components/screen';
import {useAppTheme} from '../utils/useAppTheme';
import responsive from '../theme/responsive';
import type {AppStackParamList} from '../navigators/AppStackParamList';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const {themed, theme} = useAppTheme();

  const titleSize = responsive.useResponsiveFontSize({base: 22, sm: 24, md: 26});
  const bodySize = responsive.useResponsiveFontSize(16);
  const pad = responsive.useResponsiveSpacing(theme.spacing.md);

  return (
    <Screen preset="scroll" backgroundColor={theme.colors.background}>
      <View style={{padding: pad, gap: pad}}>
        <Text
          style={themed(t => ({
            fontSize: titleSize,
            fontFamily: t.typography.bricolage.bold,
            color: t.colors.text,
          }))}>
          AccoNetwork
        </Text>
        <Text
          style={themed(t => ({
            fontSize: bodySize,
            fontFamily: t.typography.bricolage.normal,
            color: t.colors.textDim,
          }))}>
          Theme and responsive hooks match your our-app setup. Open details to
          try the stack.
        </Text>
        <Pressable
          onPress={() => navigation.navigate('Details', {title: 'From Home'})}
          style={themed((t: Theme): ViewStyle => ({
            backgroundColor: t.colors.tint,
            paddingVertical: t.spacing.sm,
            paddingHorizontal: t.spacing.md,
            borderRadius: 8,
            alignSelf: 'flex-start',
          }))}>
          <Text
            style={themed(t => ({
              color: t.colors.palette.neutral100,
              fontFamily: t.typography.bricolage.medium,
              fontSize: bodySize,
            }))}>
            Go to Details
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
