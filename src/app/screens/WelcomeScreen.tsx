import {observer} from 'mobx-react-lite';
import {Image, StyleSheet} from 'react-native';
import {
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from '../../components/ui';
import {Screen} from '../components';
import {useAuth} from '../hooks/useAuth';
import {showAuthSetupRequiredFeedback} from '../utils/showAuthSetupRequiredFeedback';
import {useAppTheme} from '../utils/useAppTheme';
import {appIcon} from '../../assets/icons';

const FEATURES = [
  {
    title: 'PGs by location',
    body: 'Browse and connect with paying-guest (PG) options tied to real places—so you know what is available where you need to stay.',
  },
  {
    title: 'People nearby',
    body: 'Meet others around the same area—flatmates, hosts, or neighbours—so local moves and stays feel less uncertain.',
  },
  {
    title: 'Secure sign-in',
    body: 'Sign in with Google. We never see or store your Google password, and we use industry-standard protection in transit.',
  },
] as const;

export const WelcomeScreen = observer(function WelcomeScreen() {
  const {theme} = useAppTheme();
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
    <Screen
      preset="scroll"
      backgroundColor={theme.colors.background}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
      <Box className="flex-1 px-6 pb-10 pt-2">
        <VStack space="2xl" className="flex-1">
          <VStack space="lg" className="items-center pt-4">
            <Box className="rounded-[22px] overflow-hidden shadow-hard-2">
              <Image
                source={appIcon}
                style={styles.heroIcon}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
            </Box>
            <VStack space="sm" className="items-center max-w-md">
              <Heading
                size="3xl"
                className="text-center text-typography-950 font-bold text-black tracking-tight">
                Basera
              </Heading>
              <Text
                size="sm"
                className="text-center text-typography-800 leading-normal px-2">
                बसेरा — a Hindi word for shelter, home, or a place to stay.
              </Text>
              <Text
                size="md"
                className="text-center text-typography-500 leading-relaxed px-1">
                Basera helps you find PGs at specific locations and connect with
                people in those places—whether you are moving, hosting, or
                building a local circle.
              </Text>
            </VStack>
          </VStack>

          <Divider className="bg-outline-200 my-1" />

          <VStack space="lg" className="px-0.5">
            <Text
              size="sm"
              bold
              className="text-typography-800 uppercase text-black tracking-wide">
              What Basera is for
            </Text>
            <VStack space="md">
              {FEATURES.map(item => (
                <HStack key={item.title} space="md" className="items-start">
                  <Box className="mt-1.5 h-2 w-2 rounded-full bg-primary-500" />
                  <VStack space="xs" className="flex-1">
                    <Text size="md" bold className="text-typography-900">
                      {item.title}
                    </Text>
                    <Text
                      size="sm"
                      className="text-typography-500 leading-snug">
                      {item.body}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>

          <Box className="min-h-6 flex-1" />

          <VStack space="md" className="w-full">
            {friendlyError ? (
              <Text
                size="sm"
                className="text-center text-error-600 px-2"
                accessibilityLiveRegion="polite">
                {friendlyError}
              </Text>
            ) : null}

            <Button
              accessibilityLabel="Sign in with Google"
              accessibilityHint="Opens Google sign-in to access your account"
              action="secondary"
              variant="outline"
              size="lg"
              disabled={isAuthenticating}
              onPress={handleGooglePress}
              className="w-full min-h-[52px] border-outline-300 bg-background-0 data-[active=true]:bg-background-50">
              {isAuthenticating ? (
                <ButtonSpinner color={theme.colors.text} />
              ) : (
                <ButtonText className="text-typography-900 font-semibold">
                  Continue with Google
                </ButtonText>
              )}
            </Button>

            <Text
              size="xs"
              className="text-center text-typography-400 leading-normal px-2">
              By continuing, you agree to our Terms of Service and Privacy
              Policy. Authentication is provided by Google; Basera does not
              receive your Google password.
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Screen>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 22,
  },
});
