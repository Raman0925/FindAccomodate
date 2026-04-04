import {useWindowDimensions, Platform} from 'react-native';
import dimensions, {breakpoints} from './dimensions';

export type ResponsiveValue<T> = {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  base: T;
};

type BreakpointKey = keyof typeof breakpoints;

// Define breakpoint thresholds in descending order with their keys
const breakpointThresholds: [BreakpointKey, number][] = [
  ['xl', breakpoints.xl],
  ['lg', breakpoints.lg],
  ['md', breakpoints.md],
  ['sm', breakpoints.sm],
  ['xs', breakpoints.xs],
];

/**
 * Hook for getting current breakpoint based on window dimensions
 * @returns Current breakpoint key
 */
export function useBreakpoint(): BreakpointKey {
  const {width} = useWindowDimensions();

  // Find the current breakpoint based on screen width
  const currentIndex = breakpointThresholds.findIndex(
    ([_, threshold]) => width >= threshold,
  );

  // If no breakpoint matches, default to xs
  if (currentIndex === -1) {
    return 'xs';
  }

  return breakpointThresholds[currentIndex][0];
}

/**
 * Hook for getting responsive value based on current breakpoint
 * @param values - Object containing values for different breakpoints
 * @returns The appropriate value for the current screen size
 */
export function useResponsiveValue<T>(values: ResponsiveValue<T>): T {
  const {width} = useWindowDimensions();
  return getResponsiveValueByWidth(values, width);
}

/**
 * Helper function to get responsive value based on provided width
 * @param values - Object containing values for different breakpoints
 * @param width - Screen width to use for calculation
 * @returns The appropriate value for the provided width
 */
function getResponsiveValueByWidth<T>(
  values: ResponsiveValue<T>,
  width: number,
): T {
  const {base} = values;

  // Find the current breakpoint based on screen width
  let currentIndex = breakpointThresholds.findIndex(
    ([_, threshold]) => width >= threshold,
  );

  // If no breakpoint matches (unlikely), default to xs
  if (currentIndex === -1) {
    currentIndex = breakpointThresholds.length - 1;
  }

  // Get the current breakpoint key
  const currentBreakpoint = breakpointThresholds[currentIndex][0];

  // Check if there's a value for the current breakpoint
  if (values[currentBreakpoint] !== undefined) {
    return values[currentBreakpoint] as T;
  }

  // If not, iterate through smaller breakpoints to find a value
  for (let i = currentIndex + 1; i < breakpointThresholds.length; i++) {
    const breakpoint = breakpointThresholds[i][0];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint] as T;
    }
  }

  // If no breakpoint value is found, return the base value
  return base;
}

/**
 * Creates a responsive value that changes based on screen width (for backward compatibility)
 * @param values - Object containing values for different breakpoints
 * @returns The appropriate value for the current screen size
 */
export function createResponsiveValue<T>(values: ResponsiveValue<T>): T {
  const {width} = dimensions.window;
  return getResponsiveValueByWidth(values, width);
}

/**
 * Creates a responsive font size
 * @param size - Base font size or responsive object
 * @returns Scaled font size
 */
export function responsiveFontSize(
  size: number | ResponsiveValue<number>,
): number {
  const value = typeof size === 'number' ? {base: size} : size;
  const fontSize = createResponsiveValue(value);
  return dimensions.moderateScale(fontSize, 0.3);
}

/**
 * Creates a responsive spacing value
 * @param size - Base spacing size or responsive object
 * @returns Scaled spacing value
 */
export function responsiveSpacing(
  size: number | ResponsiveValue<number>,
): number {
  const value = typeof size === 'number' ? {base: size} : size;
  const spacing = createResponsiveValue(value);
  return dimensions.scale(spacing);
}

/**
 * Creates a responsive height based on percentage of screen height
 * @param percentage - Percentage of screen height (0-100)
 * @returns Calculated height in device pixels
 */
export function responsiveHeight(
  percentage: number | ResponsiveValue<number>,
): number {
  const value =
    typeof percentage === 'number' ? {base: percentage} : percentage;
  const heightPercentage = createResponsiveValue(value);
  return dimensions.window.height * (heightPercentage / 100);
}

/**
 * Creates a responsive width based on percentage of screen width
 * @param percentage - Percentage of screen width (0-100)
 * @returns Calculated width in device pixels
 */
export function responsiveWidth(
  percentage: number | ResponsiveValue<number>,
): number {
  const value =
    typeof percentage === 'number' ? {base: percentage} : percentage;
  const widthPercentage = createResponsiveValue(value);
  return dimensions.window.width * (widthPercentage / 100);
}

/**
 * React hook version of responsiveFontSize
 * @param size - Base font size or responsive object
 * @returns Scaled font size that updates with dimension changes
 */
export function useResponsiveFontSize(
  size: number | ResponsiveValue<number>,
): number {
  const value = typeof size === 'number' ? {base: size} : size;
  const fontSize = useResponsiveValue(value);
  return dimensions.moderateScale(fontSize, 0.3);
}

/**
 * React hook version of responsiveSpacing
 * @param size - Base spacing size or responsive object
 * @returns Scaled spacing value that updates with dimension changes
 */
export function useResponsiveSpacing(
  size: number | ResponsiveValue<number>,
): number {
  const value = typeof size === 'number' ? {base: size} : size;
  const spacing = useResponsiveValue(value);
  return dimensions.scale(spacing);
}

/**
 * React hook version of responsiveHeight
 * @param percentage - Percentage of screen height (0-100)
 * @returns Calculated height that updates with dimension changes
 */
export function useResponsiveHeight(
  percentage: number | ResponsiveValue<number>,
): number {
  const value =
    typeof percentage === 'number' ? {base: percentage} : percentage;
  const heightPercentage = useResponsiveValue(value);
  const {height} = useWindowDimensions();
  return height * (heightPercentage / 100);
}

/**
 * React hook version of responsiveWidth
 * @param percentage - Percentage of screen width (0-100)
 * @returns Calculated width that updates with dimension changes
 */
export function useResponsiveWidth(
  percentage: number | ResponsiveValue<number>,
): number {
  const value =
    typeof percentage === 'number' ? {base: percentage} : percentage;
  const widthPercentage = useResponsiveValue(value);
  const {width} = useWindowDimensions();
  return width * (widthPercentage / 100);
}

/**
 * Creates a platform-specific value
 * @param options - Object with ios and android values
 * @returns Platform-specific value
 */
export function platformValue<T>(options: {ios: T; android: T}): T {
  return Platform.select(options) as T;
}

// Export the responsive utilities
const responsive = {
  createResponsiveValue,
  responsiveFontSize,
  responsiveSpacing,
  responsiveHeight,
  responsiveWidth,
  platformValue,
  // Hook-based exports
  useBreakpoint,
  useResponsiveValue,
  useResponsiveFontSize,
  useResponsiveSpacing,
  useResponsiveHeight,
  useResponsiveWidth,
};

export default responsive;
