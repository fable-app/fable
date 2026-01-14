/**
 * StoryCollection Component
 * Displays a list of stories with staggered entrance animations
 * Follows Japanese minimalist design with touch interactions
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { colors, typography, spacing, animationConfigs } from '@/design-system';
import { StoryCard } from './StoryCard';
import type { StoryMetadata } from '@/types';

interface StoryWithProgress extends StoryMetadata {
  progress: number; // 0-100
}

interface StoryCollectionProps {
  stories: StoryWithProgress[];
  onStoryPress: (storyId: string) => void;
}

export function StoryCollection({ stories, onStoryPress }: StoryCollectionProps) {
  // Animation refs for staggered entrance
  const animatedValues = useRef(
    stories.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Only animate first 6 cards (maxItems from design system)
    const maxAnimated = Math.min(stories.length, animationConfigs.stagger.maxItems);

    // Create staggered animations
    const animations = animatedValues.slice(0, maxAnimated).map((animValue, index) => {
      return Animated.timing(animValue, {
        toValue: 1,
        duration: animationConfigs.elementEntrance.duration,
        delay: index * animationConfigs.stagger.delay,
        useNativeDriver: true,
      });
    });

    // Set remaining cards to visible immediately (no animation)
    animatedValues.slice(maxAnimated).forEach(animValue => {
      animValue.setValue(1);
    });

    // Start animations in parallel
    Animated.parallel(animations).start();
  }, [stories.length]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fable</Text>
      </View>

      {/* Story List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {stories.map((story, index) => {
          // Only animate first 6 cards
          const shouldAnimate = index < animationConfigs.stagger.maxItems;

          const animatedStyle = shouldAnimate
            ? {
                opacity: animatedValues[index],
                transform: [
                  {
                    translateY: animatedValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0], // Slide up 10px
                    }),
                  },
                ],
              }
            : { opacity: 1 }; // No animation for cards beyond 6th

          return (
            <Animated.View key={story.id} style={[styles.cardWrapper, animatedStyle]}>
              <StoryCard
                story={story}
                progress={story.progress}
                onPress={() => onStoryPress(story.id)}
              />
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    height: 64,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.headingLarge,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  },
});
