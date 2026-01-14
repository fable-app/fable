import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '@/design-system';
import { useStoryProgress } from '@/hooks';
import { SentenceCard } from './SentenceCard';
import type { Story } from '@/types';

interface BilingualReaderProps {
  story: Story;
}

export function BilingualReader({ story }: BilingualReaderProps) {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const { progress, updateProgress } = useStoryProgress(story.id);

  // Track card heights and positions
  const cardPositions = useRef<number[]>([]);

  // Save progress when sentence changes
  useEffect(() => {
    if (currentSentence > 0) {
      updateProgress({
        storyId: story.id,
        sentenceIndex: currentSentence,
        totalSentences: story.sentences.length,
      });
    }
  }, [currentSentence, story.id, story.sentences.length, updateProgress]);

  // Calculate which sentence is visible based on scroll position
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    // Find which sentence card is currently visible
    // Estimate: each card is ~150px, find approximate index
    const estimatedIndex = Math.floor(scrollY / 150);
    const clampedIndex = Math.min(
      Math.max(0, estimatedIndex),
      story.sentences.length - 1
    );

    if (clampedIndex !== currentSentence) {
      setCurrentSentence(clampedIndex);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {story.titleGerman}
        </Text>

        <View style={styles.placeholder} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {story.sentences.map((sentence) => (
          <SentenceCard key={sentence.id} sentence={sentence} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    height: 64,
    backgroundColor: colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 24,
    color: colors.text.accent,
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.primary,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  placeholder: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
