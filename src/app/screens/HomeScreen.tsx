import {observer} from 'mobx-react-lite';
import {Pressable, Text, View, type ViewStyle} from 'react-native';
import type {Theme} from '../theme';
import {useNavigation} from '@react-navigation/native';
import {Screen} from '../components/screen';
import {useAppTheme} from '../utils/useAppTheme';
import responsive from '../theme/responsive';
import type {MainTabsCompositeNavigation} from '../navigators/navigationTypes';
import {uiStore} from '../models';

export const HomeScreen = observer(function HomeScreen() {
  const navigation = useNavigation<MainTabsCompositeNavigation>();
  const {themed, theme} = useAppTheme();

  const titleSize = responsive.useResponsiveFontSize({
    base: 22,
    sm: 24,
    md: 26,
  });
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
          Bottom tabs + MobX (uiStore). Tap below updates the count on Explore.
        </Text>
        <Text
          style={themed(t => ({
            fontSize: bodySize,
            fontFamily: t.typography.bricolage.normal,
            color: t.colors.textDim,
          }))}>
          uiStore.homeTapCount: {uiStore.homeTapCount}
        </Text>
        <Pressable
          onPress={() => {
            uiStore.incrementHomeTaps();
            navigation.navigate('Details', {title: 'From Home'});
          }}
          style={themed(
            (t: Theme): ViewStyle => ({
              backgroundColor: t.colors.tint,
              paddingVertical: t.spacing.sm,
              paddingHorizontal: t.spacing.md,
              borderRadius: 8,
              alignSelf: 'flex-start',
            }),
          )}>
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
});
