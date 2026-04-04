import type {ComponentType, ReactNode} from 'react';
import {
  Pressable,
  Text,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import type {ThemedStyle} from '../theme';
import {useAppTheme} from '../utils/useAppTheme';

type Presets = 'default' | 'filled' | 'reversed';

export interface ButtonAccessoryProps {
  style: StyleProp<ViewStyle>;
  pressableState: PressableStateCallbackType;
  disabled?: boolean;
}

export interface ButtonProps extends PressableProps {
  /** Primary label (Ignite-style). */
  text?: string;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pressedTextStyle?: StyleProp<TextStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;
  preset?: Presets;
  RightAccessory?: ComponentType<ButtonAccessoryProps>;
  LeftAccessory?: ComponentType<ButtonAccessoryProps>;
  children?: ReactNode;
  disabled?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
}

/**
 * Themed action button (Ignite boilerplate pattern).
 * @see https://docs.infinite.red/ignite-cli/boilerplate/app/components/Button/
 */
export function Button(props: ButtonProps) {
  const {
    text,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    disabled,
    disabledStyle: $disabledViewStyleOverride,
    ...rest
  } = props;

  const {themed} = useAppTheme();
  const preset: Presets = props.preset ?? 'default';

  function $viewStyle({
    pressed,
  }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [
      themed($viewPresets[preset]),
      $viewStyleOverride,
      !!pressed && themed($pressedViewPresets[preset]),
      !!pressed && $pressedViewStyleOverride,
      !!disabled && $disabledViewStyleOverride,
    ];
  }

  function $textStyle({
    pressed,
  }: PressableStateCallbackType): StyleProp<TextStyle> {
    return [
      themed($textPresets[preset]),
      $textStyleOverride,
      !!pressed && themed($pressedTextPresets[preset]),
      !!pressed && $pressedTextStyleOverride,
      !!disabled && $disabledTextStyleOverride,
    ];
  }

  return (
    <Pressable
      style={$viewStyle}
      disabled={disabled}
      accessibilityRole="button"
      {...rest}>
      {state => (
        <>
          {!!LeftAccessory && (
            <LeftAccessory
              style={themed($leftAccessoryStyle)}
              pressableState={state}
              disabled={disabled}
            />
          )}

          {text != null && text !== '' ? (
            <Text style={$textStyle(state)} numberOfLines={1}>
              {text}
            </Text>
          ) : null}
          {children}

          {!!RightAccessory && (
            <RightAccessory
              style={themed($rightAccessoryStyle)}
              pressableState={state}
              disabled={disabled}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

const $row: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const $baseViewStyle: ThemedStyle<ViewStyle> = ({spacing}) => ({
  minHeight: 56,
  borderRadius: 4,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.sm,
  overflow: 'hidden',
});

const $baseTextStyle: ThemedStyle<TextStyle> = ({typography}) => ({
  fontSize: 16,
  lineHeight: 20,
  fontFamily: typography.bricolage.medium,
  textAlign: 'center',
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
});

const $rightAccessoryStyle: ThemedStyle<ViewStyle> = ({spacing}) => ({
  marginStart: spacing.xs,
  zIndex: 1,
});

const $leftAccessoryStyle: ThemedStyle<ViewStyle> = ({spacing}) => ({
  marginEnd: spacing.xs,
  zIndex: 1,
});

const $viewPresets: Record<
  Presets,
  ThemedStyle<ViewStyle> | ThemedStyle<ViewStyle>[]
> = {
  default: [
    $row,
    $baseViewStyle,
    ({colors}) => ({
      borderWidth: 1,
      borderColor: colors.palette.neutral400,
      backgroundColor: colors.palette.neutral100,
    }),
  ],
  filled: [
    $row,
    $baseViewStyle,
    ({colors}) => ({backgroundColor: colors.palette.neutral300}),
  ],
  reversed: [
    $row,
    $baseViewStyle,
    ({colors}) => ({backgroundColor: colors.palette.neutral800}),
  ],
};

const $textPresets: Record<
  Presets,
  ThemedStyle<TextStyle> | ThemedStyle<TextStyle>[]
> = {
  default: [$baseTextStyle],
  filled: [$baseTextStyle],
  reversed: [
    $baseTextStyle,
    ({colors}) => ({color: colors.palette.neutral100}),
  ],
};

const $pressedViewPresets: Record<Presets, ThemedStyle<ViewStyle>> = {
  default: ({colors}) => ({backgroundColor: colors.palette.neutral200}),
  filled: ({colors}) => ({backgroundColor: colors.palette.neutral400}),
  reversed: ({colors}) => ({backgroundColor: colors.palette.neutral700}),
};

const $pressedTextPresets: Record<Presets, ThemedStyle<TextStyle>> = {
  default: () => ({opacity: 0.9}),
  filled: () => ({opacity: 0.9}),
  reversed: () => ({opacity: 0.9}),
};
