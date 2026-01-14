import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '@/design-system';
import { useStoryProgress } from '@/hooks';
import type { Story, Sentence } from '@/types';

interface BilingualReaderProps {
  story: Story;
}

export function BilingualReader({ story }: BilingualReaderProps) {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const { progress, updateProgress } = useStoryProgress(story.id);
  const sentenceRefs = useRef<Map<number, View>>(new Map());
  const sentencePositions = useRef<Map<number, number>>(new Map());
  const hasScrolledToProgress = useRef(false);

  // Scroll to last read position on mount
  useEffect(() => {
    if (progress && !hasScrolledToProgress.current && sentencePositions.current.size > 0) {
      const lastIndex = progress.lastSentenceIndex;
      const position = sentencePositions.current.get(lastIndex);

      if (position !== undefined && scrollViewRef.current) {
        // Delay to ensure layout is complete
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: position, animated: false });
          setCurrentSentence(lastIndex);
          hasScrolledToProgress.current = true;
        }, 100);
      }
    }
  }, [progress, sentencePositions.current.size]);

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

  // Track which sentence is currently visible
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    // Find which sentence is currently at the top of the viewport
    let closestIndex = 0;
    let minDistance = Infinity;

    sentencePositions.current.forEach((position, index) => {
      const distance = Math.abs(position - scrollY);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== currentSentence) {
      setCurrentSentence(closestIndex);
    }
  };

  // Measure sentence positions for accurate scroll tracking
  const handleSentenceLayout = (index: number, y: number) => {
    sentencePositions.current.set(index, y);
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
        scrollEventThrottle={200}
      >
        {story.sentences.map((sentence, index) => (
          <View
            key={sentence.id}
            style={styles.sentencePair}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              handleSentenceLayout(index, layout.y);
            }}
          >
            <Text style={styles.germanText}>{sentence.german}</Text>
            <Text style={styles.englishText}>{sentence.english}</Text>
          </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  sentencePair: {
    marginBottom: spacing.xl,
  },
  germanText: {
    fontFamily: 'Literata_400Regular',
    fontSize: typography.sizes.bodyLarge,
    lineHeight: typography.sizes.bodyLarge * typography.lineHeights.loose,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  englishText: {
    fontFamily: 'Literata_400Regular',
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.loose,
    color: colors.text.secondary,
  },
});
