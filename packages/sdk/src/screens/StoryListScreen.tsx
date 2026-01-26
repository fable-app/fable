/**
 * StoryListScreen
 * Main screen showing available stories
 * Port from Expo Router to React Navigation
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getAllStoryMetadata } from '@fable/core';
import type { StoryMetadata } from '@fable/core';
import { colors, typography, spacing, animations, animationConfigs } from '@fable/design-system';
import { StoryCard } from '../components/StoryCard';
import { useAllProgress, calculateBookProgress } from '../hooks/useProgress';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'StoryList'>;

export function StoryListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const storyMetadata = getAllStoryMetadata();
  const { progressMap } = useAllProgress();

  // Animation refs for staggered entrance
  const animatedValues = React.useRef(
    storyMetadata.map(() => new Animated.Value(0))
  ).current;

  React.useEffect(() => {
    // Only animate first 6 cards
    const maxAnimated = Math.min(storyMetadata.length, animationConfigs.stagger.maxItems);

    // Create staggered animations
    const anims = animatedValues.slice(0, maxAnimated).map((animValue, index) => {
      return Animated.timing(animValue, {
        toValue: 1,
        duration: animationConfigs.elementEntrance.duration,
        delay: index * animationConfigs.stagger.delay,
        useNativeDriver: true,
      });
    });

    // Set remaining cards to visible immediately
    animatedValues.slice(maxAnimated).forEach(animValue => {
      animValue.setValue(1);
    });

    // Start animations
    Animated.parallel(anims).start();
  }, [storyMetadata.length]);

  // Combine story metadata with real progress
  const storiesWithProgress = storyMetadata.map((story: StoryMetadata) => {
    let progress = 0;

    if (story.isMultiChapter && story.chapters) {
      const chapterIds = story.chapters.map(ch => ch.id);
      progress = calculateBookProgress(story.id, chapterIds, progressMap);
    } else {
      progress = progressMap[story.id]?.percentage || 0;
    }

    return {
      ...story,
      progress,
    };
  });

  const handleStoryPress = (storyId: string) => {
    const story = storyMetadata.find((s: StoryMetadata) => s.id === storyId);

    if (story?.isMultiChapter) {
      // Navigate to chapter list
      navigation.navigate('ChapterList', { bookId: storyId });
    } else {
      // Navigate directly to reader
      navigation.navigate('Reader', { storyId });
    }
  };

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
        {storiesWithProgress.map((story, index) => {
          const shouldAnimate = index < animationConfigs.stagger.maxItems;

          const animatedStyle = shouldAnimate
            ? {
                opacity: animatedValues[index],
                transform: [
                  {
                    translateY: animatedValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              }
            : { opacity: 1 };

          return (
            <Animated.View key={story.id} style={[styles.cardWrapper, animatedStyle]}>
              <StoryCard
                story={story}
                progress={story.progress}
                onPress={() => handleStoryPress(story.id)}
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
