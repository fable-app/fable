/**
 * StoryCard Component
 * Displays a story with title, metadata, and progress indicator
 * Follows Japanese minimalist design with touch interactions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { colors, typography, spacing } from '@/design-system';
import { ProgressBar } from './ProgressBar';
import type { StoryMetadata } from '@/types';

interface StoryCardProps {
  story: StoryMetadata;
  progress: number; // 0-100
  onPress: () => void;
}

export function StoryCard({ story, progress, onPress }: StoryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      {/* German Title with optional chapter badge */}
      <View style={styles.titleRow}>
        <Text style={styles.titleGerman} numberOfLines={1}>
          {story.titleGerman}
        </Text>
        {story.isMultiChapter && (
          <View style={styles.chapterBadge}>
            <Text style={styles.chapterBadgeText}>
              {story.chapterCount} chapters
            </Text>
          </View>
        )}
      </View>

      {/* English Title */}
      <Text style={styles.titleEnglish} numberOfLines={1}>
        {story.titleEnglish}
      </Text>

      {/* Metadata Row */}
      <Text style={styles.metadata} numberOfLines={1}>
        {story.author} · {story.wordCount} words
      </Text>

      {/* Progress Bar */}
      <ProgressBar progress={progress} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    backgroundColor: colors.background.elevated,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  cardPressed: {
    backgroundColor: colors.background.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    transform: [{ scale: 0.98 }],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  titleGerman: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.heading,
    lineHeight: typography.sizes.heading * typography.lineHeights.normal,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tight,
    flex: 1,
  },
  chapterBadge: {
    backgroundColor: colors.background.accent, // Light sage background
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  chapterBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: colors.background.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleEnglish: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.body,
    lineHeight: 21,
    color: colors.text.secondary,
  },
  metadata: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.bodySmall,
    lineHeight: 18,
    color: colors.text.tertiary,
  },
});
