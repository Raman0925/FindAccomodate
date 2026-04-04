import {Platform} from 'react-native';
const fonts = {
  bricolageGrotesque: {
    normal: Platform.select({
      ios: 'BricolageGrotesque',
      android: 'BricolageGrotesque',
    }),
    medium: Platform.select({
      ios: 'BricolageGrotesque-Medium',
      android: 'BricolageGrotesqueMedium',
    }),
    bold: Platform.select({
      ios: 'BricolageGrotesque-Bold',
      android: 'BricolageGrotesqueBold',
    }),
  },
  instrumentSans: {
    normal: Platform.select({
      ios: 'InstrumentSans',
      android: 'InstrumentSans',
    }),
    bold: Platform.select({
      ios: 'InstrumentSans-Bold',
      android: 'InstrumentSansBold',
    }),
    medium: Platform.select({
      ios: 'InstrumentSans-Medium',
      android: 'InstrumentSansMedium',
    }),
  },
  instrumentSerif: {
    italic: Platform.select({
      ios: 'InstrumentSerif-Italic',
      android: 'InstrumentSerif-Italic',
    }),
  },
  helveticaNeue: {
    // iOS only font.
    thin: 'HelveticaNeue-Thin',
    light: 'HelveticaNeue-Light',
    normal: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
  },
  courier: {
    // iOS only font.
    normal: 'Courier',
  },
  sansSerif: {
    // Android only font.
    thin: 'sans-serif-thin',
    light: 'sans-serif-light',
    normal: 'sans-serif',
    medium: 'sans-serif-medium',
  },
  monospace: {
    // Android only font.
    normal: 'monospace',
  },
};
export const typography = {
  ...fonts,
  secondary: Platform.select({
    ios: fonts.helveticaNeue,
    android: fonts.sansSerif,
  }),
  code: Platform.select({ios: fonts.courier, android: fonts.monospace}),
  bricolage: fonts.bricolageGrotesque,
  bricolageBold: fonts.bricolageGrotesque.bold,
  instrument: fonts.instrumentSans,
  instrumentBold: fonts.instrumentSans.bold,
  instrumentSerif: fonts.instrumentSerif,
};
