import {useCallback, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {Button, type ButtonAccessoryProps} from '../components/Button';
import {Screen} from '../components/screen';
import {useAppTheme} from '../utils/useAppTheme';
import responsive from '../theme/responsive';
import {appIcon} from '../../assets/icons';
import type {AppStackParamList} from '../navigators/AppStackParamList';

type WelcomeNav = NativeStackNavigationProp<AppStackParamList, 'Welcome'>;

function GoogleMarkAccessory({style}: ButtonAccessoryProps) {
  return (
    <View style={style}>
      <Text style={styles.googleMark}>G</Text>
    </View>
  );
}

/**
 * Stub: replace with `@react-native-google-signin/google-signin` + your web client ID.
 */
async function signInWithGoogleStub(): Promise<void> {
  await new Promise<void>(r => setTimeout(r, 600));
}

export function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNav>();
  const {themed, theme} = useAppTheme();
  const [busy, setBusy] = useState(false);

  const titleSize = responsive.useResponsiveFontSize({
    base: 26,
    sm: 28,
    md: 30,
  });
  const bodySize = responsive.useResponsiveFontSize(16);
  const pad = responsive.useResponsiveSpacing(theme.spacing.lg);
  const padTop = responsive.useResponsiveSpacing(theme.spacing.xl);
  const iconSize = responsive.useResponsiveSpacing(100);
  const iconRadius = responsive.useResponsiveSpacing(22);

  const onGooglePress = useCallback(async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      await signInWithGoogleStub();
      navigation.reset({
        index: 0,
        routes: [{name: 'MainTabs'}],
      });
    } finally {
      setBusy(false);
    }
  }, [busy, navigation]);

  return (
    <Screen preset="fixed" backgroundColor={theme.colors.background}>
      <View
        style={[
          styles.column,
          {
            paddingHorizontal: pad,
            paddingTop: padTop,
            paddingBottom: pad,
          },
        ]}>
        <View style={[styles.headerBlock, {gap: theme.spacing.md}]}>
          <Image
            source={appIcon}
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: iconRadius,
            }}
            resizeMode="cover"
          />
          <Text
            style={themed(t => ({
              fontSize: titleSize,
              fontFamily: t.typography.bricolage.bold,
              color: t.colors.text,
              textAlign: 'center',
            }))}>
            Welcome
          </Text>
          <Text
            style={themed(t => ({
              fontSize: bodySize,
              fontFamily: t.typography.bricolage.normal,
              color: t.colors.textDim,
              textAlign: 'center',
            }))}>
            Sign in to continue to AccoNetwork
          </Text>
        </View>

        <Button
          accessibilityLabel="Sign in with Google"
          disabled={busy}
          onPress={onGooglePress}
          preset="default"
          text={busy ? '' : 'Sign in with Google'}
          LeftAccessory={busy ? undefined : GoogleMarkAccessory}
          textStyle={themed(t => ({
            fontSize: bodySize,
            fontFamily: t.typography.bricolage.medium,
            color: t.colors.text,
          }))}
          style={themed(t => ({
            borderRadius: 12,
            paddingVertical: t.spacing.md,
            paddingHorizontal: t.spacing.lg,
            gap: t.spacing.sm,
            opacity: busy ? 0.7 : 1,
          }))}>
          {busy ? <ActivityIndicator color={theme.colors.text} /> : null}
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerBlock: {
    alignItems: 'center',
  },
  googleMark: {
    fontSize: 20,
  },
});
