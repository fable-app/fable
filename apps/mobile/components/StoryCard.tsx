/**
 * StoryCard Component
 * Displays a story with title, metadata, and progress indicator
 * Follows Japanese minimalist design with touch interactions
 */

import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

import type { StoryMetadata } from "@fable/core";
import { colors, typography, spacing } from "@fable/design-system";

import { ProgressBar } from "./ProgressBar";

interface StoryCardProps {
  story: StoryMetadata;
  progress: number; // 0-100
  onPress: () => void;
}

export function StoryCard({ story, progress, onPress }: StoryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
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
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 12.81,
    elevation: 16,
    justifyContent: "space-between",
  },
  cardPressed: {
    backgroundColor: colors.background.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    transform: [{ scale: 0.98 }],
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  titleGerman: {
    fontFamily: "SpaceGrotesk-SemiBold",
    fontSize: typography.sizes.heading,
    lineHeight: typography.sizes.heading * typography.lineHeights.normal,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tight,
    flex: 1,
  },
  chapterBadge: {
    backgroundColor: colors.interactive.default,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  chapterBadgeText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 10,
    color: colors.background.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  titleEnglish: {
    fontFamily: "Inter_400Regular",
    fontSize: typography.sizes.body,
    lineHeight: 21,
    color: colors.text.secondary,
  },
  metadata: {
    fontFamily: "Inter_400Regular",
    fontSize: typography.sizes.bodySmall,
    lineHeight: 18,
    color: colors.text.tertiary,
  },
});
