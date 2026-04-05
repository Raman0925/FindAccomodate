import {observer} from 'mobx-react-lite';
import {Pressable, Text, View, type ViewStyle} from 'react-native';
import type {Theme} from '../theme';
import {Screen} from '../components/screen';
import {useAppTheme} from '../utils/useAppTheme';
import responsive from '../theme/responsive';
import {uiStore} from '../models';

export const ExploreScreen = observer(function ExploreScreen() {
  const {themed, theme} = useAppTheme();
  const pad = responsive.useResponsiveSpacing(theme.spacing.md);
  const body = responsive.useResponsiveFontSize(16);
  const titleSize = responsive.useResponsiveFontSize(22);

  return (
    <Screen preset="scroll" backgroundColor={theme.colors.background}>
      <View style={{padding: pad, gap: pad}}>
        <Text
          style={themed(t => ({
            fontSize: titleSize,
            fontFamily: t.typography.bricolage.bold,
            color: t.colors.text,
          }))}>
          Explore
        </Text>
        <Text
          style={themed(t => ({
            fontSize: body,
            fontFamily: t.typography.bricolage.normal,
            color: t.colors.textDim,
          }))}>
          This tab will surface PG listings and people to connect with, filtered
          by location. For now it shares a small demo counter with Home.
        </Text>
        <Text
          style={themed(t => ({
            fontSize: body,
            fontFamily: t.typography.bricolage.medium,
            color: t.colors.tint,
          }))}>
          Demo taps: {uiStore.homeTapCount}
        </Text>
        <Pressable
          onPress={() => uiStore.resetHomeTaps()}
          style={themed(
            (t: Theme): ViewStyle => ({
              alignSelf: 'flex-start',
              paddingVertical: t.spacing.sm,
              paddingHorizontal: t.spacing.md,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: t.colors.border,
            }),
          )}>
          <Text
            style={themed(t => ({
              fontFamily: t.typography.bricolage.medium,
              fontSize: body,
              color: t.colors.tint,
            }))}>
            Reset count
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
});
