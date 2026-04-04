import {
  ActivityIndicator,
  Image,
  Text,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {Button, type ButtonAccessoryProps} from '../components/Button';
import {useAuth} from '../hooks/useAuth';
import {Screen} from '../components/screen';
import type {ThemedStyle, Theme} from '../theme';
import responsive from '../theme/responsive';
import {showAuthSetupRequiredFeedback} from '../utils/showAuthSetupRequiredFeedback';
import {useAppTheme} from '../utils/useAppTheme';
import {appIcon} from '../../assets/icons';

const themedWelcomeColumn: ThemedStyle<ViewStyle> = (_theme: Theme) => ({
  flex: 1,
  justifyContent: 'space-between',
});

const themedWelcomeHeaderBlock: ThemedStyle<ViewStyle> = (theme: Theme) => ({
  alignItems: 'center',
  gap: theme.spacing.md,
});

function createThemedRootPadding(
  padHorizontal: number,
  padTop: number,
  padBottom: number,
): ThemedStyle<ViewStyle> {
  const applyRootPadding: ThemedStyle<ViewStyle> = (_theme: Theme) => ({
    paddingHorizontal: padHorizontal,
    paddingTop: padTop,
    paddingBottom: padBottom,
  });
  return applyRootPadding;
}

function createThemedHeroIcon(
  size: number,
  radius: number,
): ThemedStyle<ImageStyle> {
  const applyHeroIcon: ThemedStyle<ImageStyle> = (_theme: Theme) => ({
    width: size,
    height: size,
    borderRadius: radius,
  });
  return applyHeroIcon;
}

function createThemedTitle(fontSize: number): ThemedStyle<TextStyle> {
  const applyTitle: ThemedStyle<TextStyle> = (theme: Theme) => ({
    fontSize,
    fontFamily: theme.typography.bricolage.bold,
    color: theme.colors.text,
    textAlign: 'center',
  });
  return applyTitle;
}

function createThemedSubtitle(fontSize: number): ThemedStyle<TextStyle> {
  const applySubtitle: ThemedStyle<TextStyle> = (theme: Theme) => ({
    fontSize,
    fontFamily: theme.typography.bricolage.normal,
    color: theme.colors.textDim,
    textAlign: 'center',
  });
  return applySubtitle;
}

function createThemedAuthErrorLabel(fontSize: number): ThemedStyle<TextStyle> {
  const applyAuthErrorLabel: ThemedStyle<TextStyle> = (theme: Theme) => ({
    fontSize,
    fontFamily: theme.typography.bricolage.normal,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  });
  return applyAuthErrorLabel;
}

function createThemedGoogleSignInButton(
  isBusy: boolean,
): ThemedStyle<ViewStyle> {
  const applyGoogleSignInButton: ThemedStyle<ViewStyle> = (theme: Theme) => ({
    borderRadius: 12,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    opacity: isBusy ? 0.7 : 1,
  });
  return applyGoogleSignInButton;
}

function createThemedGoogleButtonText(
  fontSize: number,
): ThemedStyle<TextStyle> {
  const applyGoogleButtonText: ThemedStyle<TextStyle> = (theme: Theme) => ({
    fontSize,
    fontFamily: theme.typography.bricolage.medium,
    color: theme.colors.text,
  });
  return applyGoogleButtonText;
}

const themedWelcomeActions: ThemedStyle<ViewStyle> = (_theme: Theme) => ({
  width: '100%',
});

const themedGoogleMark: ThemedStyle<TextStyle> = (_theme: Theme) => ({
  fontSize: 20,
});

const GoogleMarkAccessoryView = (props: ButtonAccessoryProps) => {
  const {themed} = useAppTheme();
  return (
    <View style={props.style}>
      <Text style={themed(themedGoogleMark)}>G</Text>
    </View>
  );
};

const GoogleMarkAccessory = observer(GoogleMarkAccessoryView);

const WelcomeScreenView = () => {
  const {themed, theme} = useAppTheme();
  const {
    handleGoogleLogin,
    isAuthenticating,
    friendlyError,
    clearAuthError,
    canAttemptGoogleLogin,
  } = useAuth();

  const titleSize = responsive.useResponsiveFontSize({
    base: 26,
    sm: 28,
    md: 30,
  });
  const bodySize = responsive.useResponsiveFontSize(16);
  const errorSize = responsive.useResponsiveFontSize(14);

  const pad = responsive.useResponsiveSpacing(theme.spacing.lg);
  const padTop = responsive.useResponsiveSpacing(theme.spacing.xl);
  const iconSize = responsive.useResponsiveSpacing(100);
  const iconRadius = responsive.useResponsiveSpacing(22);

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
      <View
        style={[
          themed(themedWelcomeColumn),
          themed(createThemedRootPadding(pad, padTop, pad)),
        ]}>
        <View style={themed(themedWelcomeHeaderBlock)}>
          <Image
            source={appIcon}
            style={themed(createThemedHeroIcon(iconSize, iconRadius))}
            resizeMode="cover"
          />
          <Text style={themed(createThemedTitle(titleSize))}>Welcome</Text>
          <Text style={themed(createThemedSubtitle(bodySize))}>
            Sign in to continue to AccoNetwork
          </Text>
        </View>

        <View style={themed(themedWelcomeActions)}>
          {friendlyError ? (
            <Text style={themed(createThemedAuthErrorLabel(errorSize))}>
              {friendlyError}
            </Text>
          ) : null}
          <Button
            accessibilityLabel="Sign in with Google"
            disabled={isAuthenticating}
            onPress={handleGooglePress}
            preset="default"
            text={isAuthenticating ? '' : 'Sign in with Google'}
            LeftAccessory={isAuthenticating ? undefined : GoogleMarkAccessory}
            textStyle={themed(createThemedGoogleButtonText(bodySize))}
            style={themed(createThemedGoogleSignInButton(isAuthenticating))}>
            {isAuthenticating ? (
              <ActivityIndicator color={theme.colors.text} />
            ) : null}
          </Button>
        </View>
      </View>
    </Screen>
  );
};

export const WelcomeScreen = observer(WelcomeScreenView);
