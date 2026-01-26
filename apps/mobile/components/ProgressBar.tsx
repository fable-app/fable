/**
 * ProgressBar Component
 * Displays reading progress with three states:
 * - Not started (0%)
 * - In progress (1-99%)
 * - Completed (100%)
 */

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing } from '@fable/design-system';

interface ProgressBarProps {
  progress: number; // 0-100
  animated?: boolean;
}

export function ProgressBar({ progress, animated = true }: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Determine state
  const isNotStarted = clampedProgress === 0;
  const isCompleted = clampedProgress === 100;
  const isInProgress = !isNotStarted && !isCompleted;

  // Determine colors based on state
  const fillColor = isCompleted
    ? colors.progress.complete  // Sage green for completed
    : colors.progress.fill;      // Dusty rose for in progress

  const textColor = isNotStarted
    ? colors.text.tertiary       // Gray for 0%
    : isCompleted
    ? colors.progress.complete   // Sage green for 100%
    : colors.progress.fill;      // Dusty rose for in progress

  // Format text
  const progressText = isCompleted ? '100% ✓' : `${Math.round(clampedProgress)}%`;

  return (
    <View style={styles.container}>
      {/* Progress text */}
      <Text style={[styles.progressText, { color: textColor }]}>
        {progressText}
      </Text>

      {/* Progress track */}
      <View style={styles.track}>
        {/* Progress fill */}
        {clampedProgress > 0 && (
          <View
            style={[
              styles.fill,
              {
                width: `${clampedProgress}%`,
                backgroundColor: fillColor,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressText: {
    fontFamily: 'Inter_500Medium',
    fontSize: typography.sizes.label,
    lineHeight: typography.sizes.label * typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.wider,
    textAlign: 'right',
    marginBottom: spacing.xs,
  },
  track: {
    height: 6,
    backgroundColor: colors.progress.track,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
