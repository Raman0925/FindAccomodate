import {Alert, Platform, ToastAndroid} from 'react-native';
import {
  SETUP_FEEDBACK_DEV_BODY,
  SETUP_FEEDBACK_DEV_TITLE,
  SETUP_FEEDBACK_PROD_SHORT,
} from '../config/authSetupFeedback';

/**
 * When sign-in is blocked because env / native config is missing: modal detail in dev,
 * short toast on Android in production (no env or file hints).
 */
export function showAuthSetupRequiredFeedback(): void {
  if (__DEV__) {
    Alert.alert(SETUP_FEEDBACK_DEV_TITLE, SETUP_FEEDBACK_DEV_BODY);
    return;
  }
  if (Platform.OS === 'android') {
    ToastAndroid.show(SETUP_FEEDBACK_PROD_SHORT, ToastAndroid.LONG);
    return;
  }
  Alert.alert(SETUP_FEEDBACK_DEV_TITLE, SETUP_FEEDBACK_PROD_SHORT);
}
