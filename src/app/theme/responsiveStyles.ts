import {ViewStyle, TextStyle, ImageStyle, ColorValue} from 'react-native';
import dimensions from './dimensions';
import responsive, {ResponsiveValue} from './responsive';
import {Theme} from './index';

/**
 * Creates a responsive container style with adaptive padding and margins
 */
export function createResponsiveContainer(theme: Theme): ViewStyle {
  return {
    paddingHorizontal: responsive.responsiveSpacing(theme.spacing.md),
    marginBottom: responsive.responsiveSpacing(theme.spacing.md),
  };
}

/**
 * Creates a responsive row layout that adjusts for different screen sizes
 */
export function createResponsiveRow(
  options: {
    spacing?: keyof Theme['spacing'];
    alignItems?: ViewStyle['alignItems'];
    justifyContent?: ViewStyle['justifyContent'];
    wrap?: boolean;
  } = {},
): (theme: Theme) => ViewStyle {
  const {
    spacing = 'md',
    alignItems = 'center',
    justifyContent = 'space-between',
    wrap = true,
  } = options;

  return (theme: Theme) => ({
    flexDirection: 'row',
    alignItems,
    justifyContent,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap: responsive.responsiveSpacing(theme.spacing[spacing]),
  });
}

/**
 * Creates a responsive text style with adaptive font sizing
 */
export function createResponsiveText(
  options: {
    fontSize?: number | ResponsiveValue<number>;
    lineHeight?: number | ResponsiveValue<number>;
    fontFamily?: keyof Theme['typography']['bricolage'];
    colorKey?: string;
  } = {},
): (theme: Theme) => TextStyle {
  const {
    fontSize = 16,
    lineHeight,
    fontFamily = 'normal',
    colorKey = 'text',
  } = options;

  return (theme: Theme) => {
    const responsiveSize = responsive.responsiveFontSize(fontSize);
    const responsiveLineHeight = lineHeight
      ? responsive.responsiveFontSize(lineHeight)
      : responsiveSize * 1.5;

    // Use the color key to safely access the theme colors
    const color = theme.colors[
      colorKey as keyof typeof theme.colors
    ] as ColorValue;

    return {
      fontSize: responsiveSize,
      lineHeight: responsiveLineHeight,
      fontFamily: theme.typography.bricolage[fontFamily],
      color,
    };
  };
}

/**
 * Creates a responsive button style with adaptive sizing
 */
export function createResponsiveButton(
  options: {
    paddingVertical?: keyof Theme['spacing'];
    paddingHorizontal?: keyof Theme['spacing'];
    borderRadius?: number;
    backgroundColorKey?: string;
  } = {},
): (theme: Theme) => ViewStyle {
  const {
    paddingVertical = 'sm',
    paddingHorizontal = 'md',
    borderRadius = 8,
    backgroundColorKey = 'palette.neutral100',
  } = options;

  return (theme: Theme) => {
    // Safely access nested color properties using a path string
    const getNestedColor = (colorPath: string): ColorValue => {
      const parts = colorPath.split('.');
      let color: any = theme.colors;

      for (const part of parts) {
        if (color && color[part]) {
          color = color[part];
        } else {
          // Fallback to a default color if path doesn't exist
          return theme.colors.background as ColorValue;
        }
      }

      return color as ColorValue;
    };

    const backgroundColor = getNestedColor(backgroundColorKey);

    return {
      paddingVertical: responsive.responsiveSpacing(
        theme.spacing[paddingVertical],
      ),
      paddingHorizontal: responsive.responsiveSpacing(
        theme.spacing[paddingHorizontal],
      ),
      borderRadius: dimensions.moderateScale(borderRadius),
      backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    };
  };
}

/**
 * Creates a responsive image style with adaptive sizing
 */
export function createResponsiveImage(options: {
  width: number | ResponsiveValue<number>;
  height: number | ResponsiveValue<number>;
  borderRadius?: number;
}): (theme: Theme) => ImageStyle {
  const {width, height, borderRadius = 0} = options;

  return () => ({
    width:
      typeof width === 'number'
        ? dimensions.scale(width)
        : responsive.createResponsiveValue(width),
    height:
      typeof height === 'number'
        ? dimensions.scale(height)
        : responsive.createResponsiveValue(height),
    borderRadius: dimensions.moderateScale(borderRadius),
  });
}

/**
 * Creates responsive padding based on theme spacing
 */
export function createResponsivePadding(
  options: {
    horizontal?: keyof Theme['spacing'];
    vertical?: keyof Theme['spacing'];
    top?: keyof Theme['spacing'];
    bottom?: keyof Theme['spacing'];
    left?: keyof Theme['spacing'];
    right?: keyof Theme['spacing'];
  } = {},
): (theme: Theme) => ViewStyle {
  const {horizontal, vertical, top, bottom, left, right} = options;

  return (theme: Theme) => {
    const style: ViewStyle = {};

    if (horizontal) {
      style.paddingHorizontal = responsive.responsiveSpacing(
        theme.spacing[horizontal],
      );
    }
    if (vertical) {
      style.paddingVertical = responsive.responsiveSpacing(
        theme.spacing[vertical],
      );
    }
    if (top) {
      style.paddingTop = responsive.responsiveSpacing(theme.spacing[top]);
    }
    if (bottom) {
      style.paddingBottom = responsive.responsiveSpacing(theme.spacing[bottom]);
    }
    if (left) {
      style.paddingLeft = responsive.responsiveSpacing(theme.spacing[left]);
    }
    if (right) {
      style.paddingRight = responsive.responsiveSpacing(theme.spacing[right]);
    }

    return style;
  };
}

// Export the responsive style creators
const responsiveStyles = {
  container: createResponsiveContainer,
  row: createResponsiveRow,
  text: createResponsiveText,
  button: createResponsiveButton,
  image: createResponsiveImage,
  padding: createResponsivePadding,
};

export default responsiveStyles;
