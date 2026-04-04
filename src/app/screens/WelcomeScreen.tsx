import {observer} from 'mobx-react-lite';
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {Button, Screen, type ButtonAccessoryProps} from '../components';
import {useAuth} from '../hooks/useAuth';
import {responsive, spacing, ThemedStyle} from '../theme';
import {showAuthSetupRequiredFeedback} from '../utils/showAuthSetupRequiredFeedback';
import {useAppTheme} from '../utils/useAppTheme';
import {appIcon} from '../../assets/icons';

const GoogleMarkAccessory = observer(function GoogleMarkAccessory(
  props: ButtonAccessoryProps,
) {
  const {themed} = useAppTheme();
  return (
    <View style={props.style}>
      <Text style={themed($googleMark)}>G</Text>
    </View>
  );
});

export const WelcomeScreen = observer(function WelcomeScreen() {
  const {themed, theme} = useAppTheme();
  const {
    handleGoogleLogin,
    isAuthenticating,
    friendlyError,
    clearAuthError,
    canAttemptGoogleLogin,
  } = useAuth();

  const handleGooglePress = () => {
    if (isAuthenticating) {
      return;
    }
    clearAuthError();
    if (!canAttemptGoogleLogin) {
      showAuthSetupRequiredFeedback();
      return;
    }
    handleGoogleLogin();
  };

  return (
    <Screen preset="fixed" backgroundColor={theme.colors.background}>
      <View style={[themed($welcomeColumn), themed($welcomeRootPadding)]}>
        <View style={themed($welcomeHeaderBlock)}>
          <Image
            source={appIcon}
            style={themed($welcomeHeroIcon)}
            resizeMode="cover"
          />
          <Text style={themed($welcomeTitle)}>Welcome</Text>
          <Text style={themed($welcomeSubtitle)}>
            Sign in to continue to AccoNetwork
          </Text>
        </View>

        <View style={themed($welcomeActions)}>
          {friendlyError ? (
            <Text style={themed($welcomeAuthError)}>{friendlyError}</Text>
          ) : null}
          <Button
            accessibilityLabel="Sign in with Google"
            disabled={isAuthenticating}
            onPress={handleGooglePress}
            preset="default"
            text={isAuthenticating ? '' : 'Sign in with Google'}
            LeftAccessory={isAuthenticating ? undefined : GoogleMarkAccessory}
            textStyle={themed($welcomeGoogleButtonText)}
            style={themed($welcomeGoogleSignInButton(isAuthenticating))}>
            {isAuthenticating ? (
              <ActivityIndicator color={theme.colors.text} />
            ) : null}
          </Button>
        </View>
      </View>
    </Screen>
  );
});

const $welcomeColumn: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: 'space-between',
});

const $welcomeRootPadding: ThemedStyle<ViewStyle> = () => ({
  paddingHorizontal: responsive.responsiveSpacing(spacing.lg),
  paddingTop: responsive.responsiveSpacing(spacing.xl),
  paddingBottom: responsive.responsiveSpacing(spacing.lg),
});

const $welcomeHeaderBlock: ThemedStyle<ViewStyle> = ({spacing: s}) => ({
  alignItems: 'center',
  gap: s.md,
});

const $welcomeHeroIcon: ThemedStyle<ImageStyle> = () => ({
  width: responsive.responsiveSpacing(100),
  height: responsive.responsiveSpacing(100),
  borderRadius: responsive.responsiveSpacing(22),
});

const $welcomeTitle: ThemedStyle<TextStyle> = ({typography, colors: c}) => ({
  fontSize: responsive.responsiveFontSize({base: 26, sm: 28, md: 30}),
  fontFamily: typography.bricolage.bold,
  color: c.text,
  textAlign: 'center',
});

const $welcomeSubtitle: ThemedStyle<TextStyle> = ({typography, colors: c}) => ({
  fontSize: responsive.responsiveFontSize(16),
  fontFamily: typography.bricolage.normal,
  color: c.textDim,
  textAlign: 'center',
});

const $welcomeAuthError: ThemedStyle<TextStyle> = ({
  typography,
  colors: c,
  spacing: s,
}) => ({
  fontSize: responsive.responsiveFontSize(14),
  fontFamily: typography.bricolage.normal,
  color: c.error,
  textAlign: 'center',
  marginBottom: s.sm,
});

const $welcomeActions: ThemedStyle<ViewStyle> = () => ({
  width: '100%',
});

const $welcomeGoogleButtonText: ThemedStyle<TextStyle> = ({
  typography,
  colors: c,
}) => ({
  fontSize: responsive.responsiveFontSize(16),
  fontFamily: typography.bricolage.medium,
  color: c.text,
});

const $welcomeGoogleSignInButton =
  (isBusy: boolean): ThemedStyle<ViewStyle> =>
  t => ({
    borderRadius: 12,
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    gap: t.spacing.sm,
    opacity: isBusy ? 0.7 : 1,
  });

const $googleMark: ThemedStyle<TextStyle> = ({typography, colors: c}) => ({
  fontSize: responsive.responsiveFontSize(20),
  fontFamily: typography.bricolage.medium,
  color: c.text,
});
