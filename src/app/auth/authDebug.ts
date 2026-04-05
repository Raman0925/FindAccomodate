/**
 * Dev-only auth tracing (Metro + adb logcat). Never pass tokens or secrets here.
 *
 * How to read logs:
 * - Metro terminal: watch lines starting with `[AccoNetwork Auth]`
 * - Android: `npx react-native log-android` or Android Studio Logcat, filter `ReactNativeJS` / `AccoNetwork`
 */

const TAG = '[AccoNetwork Auth]';

export function logAuthStep(
  step: string,
  detail: Record<string, unknown> = {},
): void {
  if (!__DEV__) {
    return;
  }
  console.warn(`${TAG} ${step}`, detail);
}

export function logAuthFailure(step: string, err: unknown): void {
  if (!__DEV__) {
    return;
  }
  const detail: Record<string, unknown> = {step};
  if (err instanceof Error) {
    detail.name = err.name;
    detail.message = err.message;
    if ('code' in err) {
      detail.code = (err as {code: unknown}).code;
    }
  } else if (typeof err === 'object' && err !== null) {
    if ('message' in err) {
      detail.message = (err as {message: unknown}).message;
    }
    if ('code' in err) {
      detail.code = (err as {code: unknown}).code;
    }
  } else {
    detail.value = String(err);
  }
  console.error(`${TAG} FAILED`, detail);
}
