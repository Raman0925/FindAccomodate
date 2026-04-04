module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env.local',
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
      'react-native-reanimated/plugin',
    ],
  };
};
