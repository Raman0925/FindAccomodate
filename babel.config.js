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
          allowlist: ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_KEY'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
