import {Pressable, Text, View, type ViewStyle} from 'react-native';
import type {Theme} from '../theme';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Screen} from '../components/screen';
import {useAppTheme} from '../utils/useAppTheme';
import responsive from '../theme/responsive';
import type {AppStackScreenProps} from '../navigators/AppStackParamList';

type Props = AppStackScreenProps<'Details'>;

export function DetailsScreen(_props: Props) {
  const navigation = useNavigation();
  const route = useRoute<Props['route']>();
  const {themed, theme} = useAppTheme();
  const title = route.params?.title ?? 'Details';

  const pad = responsive.useResponsiveSpacing(theme.spacing.md);
  const fontSize = responsive.useResponsiveFontSize(16);

  return (
    <Screen preset="fixed" backgroundColor={theme.colors.background}>
      <View style={{padding: pad, gap: pad}}>
        <Text
          style={themed(t => ({
            fontSize: responsive.responsiveFontSize(22),
            fontFamily: t.typography.bricolage.bold,
            color: t.colors.text,
          }))}>
          {title}
        </Text>
        <Text
          style={themed(t => ({
            fontSize,
            fontFamily: t.typography.bricolage.normal,
            color: t.colors.textDim,
          }))}>
          Native stack screen with shared theme.
        </Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={themed((t: Theme): ViewStyle => ({
            borderWidth: 1,
            borderColor: t.colors.border,
            paddingVertical: t.spacing.sm,
            paddingHorizontal: t.spacing.md,
            borderRadius: 8,
            alignSelf: 'flex-start',
          }))}>
          <Text
            style={themed(t => ({
              color: t.colors.tint,
              fontFamily: t.typography.bricolage.medium,
              fontSize,
            }))}>
            Back
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
