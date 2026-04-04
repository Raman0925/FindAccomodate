import {useScrollToTop} from '@react-navigation/native';
import {ReactNode, useRef, useState} from 'react';
import {
  LayoutChangeEvent,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
  StatusBarStyle,
  StatusBarProps,
  StatusBar,
  View,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  Edge,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {$styles, colors} from '../theme';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewRef,
} from 'react-native-keyboard-controller';
import {useAppTheme} from '../utils/useAppTheme';
import LinearGradient from 'react-native-linear-gradient';

type GradientColors = readonly [string, string, ...string[]];
export const DEFAULT_BOTTOM_OFFSET = 50;

interface BaseScreenProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  statusBarStyle?: StatusBarStyle;
  keyboardOffset?: number;
  keyboardBottomOffset?: number;
  statusBarProps?: StatusBarProps; // Changed from StatusBarProps to statusBarProps
  backgroundStyle?: 'gradient' | 'solid' | 'custom';
  gradientColors?: GradientColors;
  CustomBackground?: ReactNode;
  safeAreaViewProps?: React.ComponentProps<typeof SafeAreaView>;
  safeAreaEdges?: Edge[];
  useSafeArea?: boolean;
  forceManualSafeArea?: boolean;
}

interface FixedScreenProps extends BaseScreenProps {
  preset?: 'fixed';
}
interface ScrollScreenProps extends BaseScreenProps {
  preset?: 'scroll';
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  screenScrollViewProps?: ScrollViewProps;
}
interface AutoScreenProps extends Omit<ScrollScreenProps, 'preset'> {
  preset?: 'auto';
  scrollEnabledToggleThreshold?: {percent?: number; point?: number};
}
export type ScreenProps =
  | ScrollScreenProps
  | FixedScreenProps
  | AutoScreenProps;
type ScreenPreset = 'fixed' | 'scroll' | 'auto';

function isNonScrolling(preset?: ScreenPreset) {
  return !preset || preset === 'fixed';
}

function useAutoPreset(props: AutoScreenProps) {
  const {scrollEnabledToggleThreshold} = props;
  const {percent = 0.92, point = 0} = scrollEnabledToggleThreshold || {};
  const viewH = useRef<number | null>(null);
  const contentH = useRef<number | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  function update() {
    if (viewH.current == null || contentH.current == null) {
      return;
    }
    const fits = point
      ? contentH.current < viewH.current - point
      : contentH.current < viewH.current * percent;
    if (scrollEnabled && fits) {
      setScrollEnabled(false);
    }
    if (!scrollEnabled && !fits) {
      setScrollEnabled(true);
    }
  }

  function onContentSizeChange(_: number, h: number) {
    contentH.current = h;
    update();
  }
  function onLayout(e: LayoutChangeEvent) {
    viewH.current = e.nativeEvent.layout.height;
    update();
  }
  if (props.preset === 'auto') {
    update();
  }

  return {
    scrollEnabled: props.preset === 'auto' ? scrollEnabled : true,
    onContentSizeChange,
    onLayout,
  };
}

function ScreenWithoutScrolling(props: ScreenProps) {
  const {style, contentContainerStyle, children, preset} = props;
  return (
    <View style={[$outerStyle, style]}>
      <View
        style={[
          $innerStyle,
          preset === 'fixed' && $justifyFlexEnd,
          contentContainerStyle,
        ]}>
        {children}
      </View>
    </View>
  );
}

function ScreenWithScrolling(props: ScreenProps) {
  const {
    keyboardShouldPersistTaps = 'handled',
    keyboardBottomOffset = DEFAULT_BOTTOM_OFFSET,
    contentContainerStyle: scrollContentContainerStyle,
    screenScrollViewProps,
    style,
    children,
  } = props as ScrollScreenProps;

  const ref = useRef<KeyboardAwareScrollViewRef>(null);
  useScrollToTop(ref as any);

  const {scrollEnabled, onContentSizeChange, onLayout} = useAutoPreset(
    props as AutoScreenProps,
  );

  return (
    <KeyboardAwareScrollView
      bottomOffset={keyboardBottomOffset}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      scrollEnabled={scrollEnabled}
      ref={ref}
      {...screenScrollViewProps}
      onLayout={e => {
        onLayout(e);
        screenScrollViewProps?.onLayout?.(e);
      }}
      onContentSizeChange={(w, h) => {
        onContentSizeChange(w, h);
        screenScrollViewProps?.onContentSizeChange?.(w, h);
      }}
      style={[$outerStyle, screenScrollViewProps?.style, style]}
      contentContainerStyle={[
        $innerStyle,
        screenScrollViewProps?.contentContainerStyle,
        scrollContentContainerStyle,
      ]}>
      {children}
    </KeyboardAwareScrollView>
  );
}

function BackgroundWrapper({
  backgroundStyle = 'solid',
  backgroundColor,
  gradientColors,
  CustomBackground,
  children,
  style,
  statusBarProps,
}: {
  backgroundStyle?: BaseScreenProps['backgroundStyle'];
  backgroundColor?: string;
  gradientColors?: GradientColors;
  CustomBackground?: ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  statusBarProps?: {style: StatusBarStyle; props?: StatusBarProps};
}) {
  const renderStatusBar = () => (
    <StatusBar
      barStyle={statusBarProps?.style || 'dark-content'}
      {...statusBarProps?.props}
    />
  );

  if (backgroundStyle === 'gradient' && gradientColors) {
    return (
      <View style={[$absoluteFillStyle]}>
        <LinearGradient
          colors={[...gradientColors]}
          style={[$absoluteFillStyle]}
        />
        {renderStatusBar()}
        <View style={[style, $containerStyle, $backgroundTransparent]}>
          {children}
        </View>
      </View>
    );
  }

  if (backgroundStyle === 'custom' && CustomBackground) {
    return (
      <View style={[style, $containerStyle]}>
        {renderStatusBar()}
        {CustomBackground}
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        style,
        $containerStyle,
        {backgroundColor: backgroundColor || colors.palette.neutral100},
      ]}>
      {renderStatusBar()}
      {children}
    </View>
  );
}

function getManualSafeAreaStyle(
  insets: ReturnType<typeof useSafeAreaInsets>,
  edges?: Edge[],
): ViewStyle {
  const style: ViewStyle = {};

  if (!edges || edges.includes('top')) {
    style.paddingTop = insets.top;
  }
  if (!edges || edges.includes('bottom')) {
    style.paddingBottom = insets.bottom;
  }
  if (!edges || edges.includes('left')) {
    style.paddingLeft = insets.left;
  }
  if (!edges || edges.includes('right')) {
    style.paddingRight = insets.right;
  }

  return style;
}

export function Screen(props: ScreenProps) {
  const {themeContext} = useAppTheme();
  const insets = useSafeAreaInsets();

  const {
    keyboardOffset = 0,
    safeAreaEdges,
    useSafeArea = true,
    safeAreaViewProps,
    statusBarProps,
    statusBarStyle,
    backgroundStyle = 'solid',
    backgroundColor,
    gradientColors = ['#6E38BF', '#9239AE', '#863FAF'] as const,
    CustomBackground,
    style,
    forceManualSafeArea = false,
  } = props;

  const useManualSafeArea = forceManualSafeArea || Platform.OS === 'android';
  const manualSafeAreaStyle =
    useManualSafeArea && useSafeArea
      ? getManualSafeAreaStyle(insets, safeAreaEdges)
      : {};

  const WrapperComponent =
    useSafeArea && !useManualSafeArea ? SafeAreaView : View;
  const wrapperProps =
    useSafeArea && !useManualSafeArea
      ? {
          edges: safeAreaEdges,
          ...safeAreaViewProps,
        }
      : {};

  return (
    <BackgroundWrapper
      backgroundStyle={backgroundStyle}
      backgroundColor={backgroundColor}
      gradientColors={gradientColors}
      CustomBackground={CustomBackground}
      style={style}
      statusBarProps={{
        style:
          statusBarStyle ||
          (themeContext === 'dark' ? 'light-content' : 'dark-content'),
        props: statusBarProps,
      }}>
      <WrapperComponent
        style={[$containerStyle, manualSafeAreaStyle]}
        {...wrapperProps}>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={keyboardOffset}
          style={$styles.flex1}>
          {isNonScrolling(props.preset) ? (
            <ScreenWithoutScrolling {...props} />
          ) : (
            <ScreenWithScrolling {...props} />
          )}
        </KeyboardAvoidingView>
      </WrapperComponent>
    </BackgroundWrapper>
  );
}

const $containerStyle: ViewStyle = {
  flex: 1,
  height: '100%',
  width: '100%',
};
const $outerStyle: ViewStyle = {
  flex: 1,
  height: '100%',
  width: '100%',
};
const $justifyFlexEnd: ViewStyle = {
  justifyContent: 'flex-end',
};
const $innerStyle: ViewStyle = {
  justifyContent: 'flex-start',
  alignItems: 'stretch',
};

const $absoluteFillStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const $backgroundTransparent: ViewStyle = {
  backgroundColor: 'transparent',
};
