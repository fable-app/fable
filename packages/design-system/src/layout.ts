/**
 * Layout utilities for responsive design
 * Provides consistent max-width constraints for comfortable reading on large screens
 */

import { Platform } from 'react-native';

/**
 * Maximum content width for optimal reading experience
 * Based on common readable line length (45-75 characters)
 */
export const MAX_CONTENT_WIDTH = 768;

/**
 * Get responsive container styles for centering content on large screens
 * On web with large screens, constrains width and centers content
 * On mobile or small screens, uses full width
 */
export const getResponsiveContainerStyle = () => {
  if (Platform.OS === 'web') {
    return {
      maxWidth: MAX_CONTENT_WIDTH,
      marginLeft: 'auto' as const,
      marginRight: 'auto' as const,
      width: '100%',
    };
  }

  // On mobile, use full width
  return {
    width: '100%',
  };
};

/**
 * Layout constants
 */
export const layout = {
  maxContentWidth: MAX_CONTENT_WIDTH,
  getResponsiveContainer: getResponsiveContainerStyle,
};
