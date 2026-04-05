module.exports = function (api) {
  // ESLint loads this config with NODE_ENV unset; nativewind → react-native-css-interop
  // expects metro-react-native-babel-preset (not a direct dependency). Skip NativeWind for ESLint.
  const isEslint =
    api.caller(caller => caller?.name === '@babel/eslint-parser') ?? false;
  const isTest = process.env.NODE_ENV === 'test';
  api.cache.using(() => isTest || Boolean(isEslint));

  const presets = ['module:@react-native/babel-preset'];
  if (!isTest && !isEslint) {
    presets.push('nativewind/babel');
  }

  return {
    presets,
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
          allowlist: [
            'PUBLIC_SUPABASE_URL',
            'PUBLIC_SUPABASE_KEY',
            'GOOGLE_WEB_CLIENT_ID',
            'GOOGLE_IOS_CLIENT_ID',
          ],
        },
      ],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
