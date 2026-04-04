/**
 * API Logger
 * Use for debugging and monitoring API requests/responses
 */

function readEnv(name: string): string | undefined {
  const g = globalThis as typeof globalThis & {
    process?: {env?: Record<string, string | undefined>};
  };
  return g.process?.env?.[name];
}

const ENABLE_LOGGING =
  __DEV__ && readEnv('NODE_ENV') !== 'test' && readEnv('APP_ENV') !== 'test';

/** RN `Console` typings omit the second `%c` style argument; Hermes supports it. */
function groupStyled(label: string, style: string): void {
  (console as {group: (a: string, b?: string) => void}).group(label, style);
}

const COLORS = {
  REQUEST: '#3498db',
  RESPONSE: '#2ecc71',
  ERROR: '#e74c3c',
  INFO: '#f39c12',
};

const formatData = (data: unknown): string => {
  try {
    return typeof data === 'object' && data !== null
      ? JSON.stringify(data, null, 2)
      : String(data);
  } catch {
    return 'Unable to format data';
  }
};

export const logRequest = (
  method: string,
  url: string,
  data?: unknown,
  headers?: unknown,
): void => {
  if (!ENABLE_LOGGING) {
    return;
  }

  groupStyled(
    `%c API Request: ${method.toUpperCase()} ${url}`,
    `color: ${COLORS.REQUEST}; font-weight: bold`,
  );

  if (headers) {
    console.log('%c Headers:', 'font-weight: bold', headers);
  }

  if (data !== undefined && data !== null) {
    console.log('%c Request Data:', 'font-weight: bold', formatData(data));
  }

  console.groupEnd();
};

export const logResponse = (
  method: string,
  url: string,
  response: unknown,
  statusCode: number,
  time: number,
): void => {
  if (!ENABLE_LOGGING) {
    return;
  }

  groupStyled(
    `%c API Response: ${method.toUpperCase()} ${url} (${statusCode}) - ${time}ms`,
    `color: ${COLORS.RESPONSE}; font-weight: bold`,
  );

  console.log('%c Response Data:', 'font-weight: bold', formatData(response));

  console.groupEnd();
};

export const logError = (method: string, url: string, error: unknown): void => {
  if (!ENABLE_LOGGING) {
    return;
  }

  groupStyled(
    `%c API Error: ${method.toUpperCase()} ${url}`,
    `color: ${COLORS.ERROR}; font-weight: bold`,
  );

  const err = error as {
    response?: {status?: number; data?: unknown; headers?: unknown};
    request?: unknown;
    message?: string;
    config?: unknown;
  };

  if (err.response) {
    console.log('%c Status:', 'font-weight: bold', err.response.status);
    console.log('%c Data:', 'font-weight: bold', formatData(err.response.data));
    console.log('%c Headers:', 'font-weight: bold', err.response.headers);
  } else if (err.request) {
    console.log('%c Request:', 'font-weight: bold', err.request);
  } else {
    console.log('%c Error Message:', 'font-weight: bold', err.message);
  }

  console.log('%c Error Config:', 'font-weight: bold', err.config);
  console.groupEnd();
};

export const logInfo = (message: string, data?: unknown): void => {
  if (!ENABLE_LOGGING) {
    return;
  }

  groupStyled(
    `%c API Info: ${message}`,
    `color: ${COLORS.INFO}; font-weight: bold`,
  );

  if (data !== undefined && data !== null) {
    console.log('%c Data:', 'font-weight: bold', formatData(data));
  }

  console.groupEnd();
};
