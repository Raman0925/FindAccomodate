import {Dimensions, Platform, PixelRatio, ScaledSize} from 'react-native';

// Get the current window dimensions
const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

// Base dimensions where the design is created (standard design size)
const baseWidth = 375;
const baseHeight = 812;

// Calculate the scale ratio for width and height
const widthRatio = window.width / baseWidth;
const heightRatio = window.height / baseHeight;

/**
 * Normalize a value based on the device screen width
 * @param size - The size to normalize
 * @returns The normalized size
 */
export function normalize(size: number): number {
  const newSize = size * widthRatio;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

/**
 * Scale a value based on the screen width ratio
 * @param size - The size to scale
 * @returns The scaled size
 */
export function scale(size: number): number {
  return size * widthRatio;
}

/**
 * Scale a value based on the screen height ratio
 * @param size - The size to scale
 * @returns The scaled size
 */
export function verticalScale(size: number): number {
  return size * heightRatio;
}

/**
 * Scale a value based on the smaller of width or height ratio
 * Provides a more moderate scaling
 * @param size - The size to scale
 * @param factor - Optional factor for adjusting the scaling (default: 0.5)
 * @returns The moderately scaled size
 */
export function moderateScale(size: number, factor = 0.5): number {
  return size + (scale(size) - size) * factor;
}

/**
 * Determines if the device is small (width < 360)
 */
export const isSmallDevice = window.width < 360;

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  xs: 0,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * Handle dimension changes
 * @param dimensions - The new dimensions
 */
export function handleDimensionsChange(dimensions: {
  window: ScaledSize;
  screen: ScaledSize;
}) {
  // Update dimensions if needed
  const {window: newWindow} = dimensions;
  if (newWindow.width !== window.width || newWindow.height !== window.height) {
    // Recalculate ratios if needed
    // This can be expanded if dimensions need to be reactive
  }
}

// Initial dimensions setup
const dimensions = {
  window,
  screen,
  isSmallDevice,
  normalize,
  scale,
  verticalScale,
  moderateScale,
  breakpoints,
};

// Subscribe to dimension changes
Dimensions.addEventListener('change', handleDimensionsChange);

export default dimensions;
