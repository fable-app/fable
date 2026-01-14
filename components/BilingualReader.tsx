import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
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

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSentence, setPlayingSentence] = useState<number | null>(null);
  const audioQueue = useRef<number[]>([]);

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

  // Play German audio sentence by sentence
  const playNextSentence = () => {
    if (audioQueue.current.length === 0) {
      setIsPlaying(false);
      setPlayingSentence(null);
      return;
    }

    const nextIndex = audioQueue.current.shift()!;
    const sentence = story.sentences[nextIndex];

    setPlayingSentence(nextIndex);

    // Scroll to the sentence being read
    const position = sentencePositions.current.get(nextIndex);
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position - 100, animated: true });
    }

    // Speak with German voice
    Speech.speak(sentence.german, {
      language: 'de-DE',
      rate: 0.85, // Slightly slower for learners
      pitch: 1.0,
      onDone: () => {
        playNextSentence();
      },
      onStopped: () => {
        setIsPlaying(false);
        setPlayingSentence(null);
        audioQueue.current = [];
      },
      onError: (error) => {
        console.error('Speech error:', error);
        setIsPlaying(false);
        setPlayingSentence(null);
        audioQueue.current = [];
      },
    });
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      // Pause/Stop
      await Speech.stop();
      setIsPlaying(false);
      setPlayingSentence(null);
      audioQueue.current = [];
    } else {
      // Start playing from current sentence
      audioQueue.current = Array.from(
        { length: story.sentences.length - currentSentence },
        (_, i) => currentSentence + i
      );
      setIsPlaying(true);
      playNextSentence();
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

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

        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.audioButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.audioButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
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
        {story.sentences.map((sentence, index) => {
          const isCurrentlyPlaying = playingSentence === index;

          return (
            <View
              key={sentence.id}
              style={[
                styles.sentencePair,
                isCurrentlyPlaying && styles.sentencePairHighlighted,
              ]}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                handleSentenceLayout(index, layout.y);
              }}
            >
              <Text
                style={[
                  styles.germanText,
                  isCurrentlyPlaying && styles.germanTextHighlighted,
                ]}
              >
                {sentence.german}
              </Text>
              <Text style={styles.englishText}>{sentence.english}</Text>
            </View>
          );
        })}
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
  audioButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioButtonText: {
    fontSize: 20,
    color: colors.text.accent,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  sentencePairHighlighted: {
    backgroundColor: colors.background.accent,
  },
  germanText: {
    fontFamily: 'Literata_400Regular',
    fontSize: typography.sizes.bodyLarge,
    lineHeight: typography.sizes.bodyLarge * typography.lineHeights.loose,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  germanTextHighlighted: {
    color: colors.text.accent,
    fontWeight: '600',
  },
  englishText: {
    fontFamily: 'Literata_400Regular',
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.loose,
    color: colors.text.secondary,
  },
});
