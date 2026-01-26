/**
 * ReaderScreen
 * Bilingual story reader with audio narration
 * Port from Expo Router to React Navigation
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { colors, typography, spacing } from '@fable/design-system';
import { loadStory, getStoryMetadata } from '@fable/core';
import type { Story, Sentence, StoryMetadata } from '@fable/core';
import { useStoryProgress } from '../hooks/useProgress';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Reader'>;
type RoutePropType = RouteProp<RootStackParamList, 'Reader'>;

export function ReaderScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { storyId } = route.params;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const currentSentenceRef = useRef(0);
  const sentencePositions = useRef<Map<number, number>>(new Map());
  const hasScrolledToProgress = useRef(false);

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSentence, setPlayingSentence] = useState<number | null>(null);
  const audioQueue = useRef<number[]>([]);
  const isNavigating = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0.70);
  const [germanFirst, setGermanFirst] = useState(true);

  // Chapter navigation
  const [bookMetadata, setBookMetadata] = useState<StoryMetadata | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1);
  const [previousChapterId, setPreviousChapterId] = useState<string | null>(null);
  const [nextChapterId, setNextChapterId] = useState<string | null>(null);

  const { progress, updateProgress } = useStoryProgress(storyId);

  // Load story
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const loadedStory = await loadStory(storyId);
        if (loadedStory) {
          setStory(loadedStory);
        }
      } catch (error) {
        console.error('Failed to load story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  // Configure StatusBar for Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(false);
      RNStatusBar.setBackgroundColor(colors.background.primary);
    }
  }, []);

  // Load book metadata and determine chapter navigation
  useEffect(() => {
    if (story?.bookId) {
      const loadBookInfo = async () => {
        const bookData = await loadStory(story.bookId!);
        if (bookData) {
          setBookMetadata(bookData as any);

          const chapters = (bookData as any).chapters;
          if (chapters) {
            const currentIndex = chapters.findIndex((ch: any) => ch.id === story.id);
            setCurrentChapterIndex(currentIndex);

            if (currentIndex > 0) {
              setPreviousChapterId(chapters[currentIndex - 1].id);
            }
            if (currentIndex < chapters.length - 1) {
              setNextChapterId(chapters[currentIndex + 1].id);
            }
          }
        }
      };
      loadBookInfo();
    }
  }, [story?.id, story?.bookId]);

  // Scroll to last read position on mount
  useEffect(() => {
    if (progress && !hasScrolledToProgress.current && sentencePositions.current.size > 0) {
      const lastIndex = progress.lastSentenceIndex;
      const position = sentencePositions.current.get(lastIndex);

      if (position !== undefined && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: position, animated: false });
          setCurrentSentence(lastIndex);
          hasScrolledToProgress.current = true;
        }, 100);
      }
    }
  }, [progress, sentencePositions.current.size]);

  // Update ref whenever currentSentence changes
  useEffect(() => {
    currentSentenceRef.current = currentSentence;
  }, [currentSentence]);

  // Save progress when sentence changes (debounced)
  useEffect(() => {
    if (currentSentence > 0 && story) {
      const timer = setTimeout(() => {
        updateProgress({
          storyId: story.id,
          sentenceIndex: currentSentence,
          totalSentences: story.sentences.length,
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentSentence, story, updateProgress]);

  // Track which sentence is currently visible
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;

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
    if (!story || audioQueue.current.length === 0) {
      setIsPlaying(false);
      setPlayingSentence(null);
      isNavigating.current = false;
      return;
    }

    const nextIndex = audioQueue.current[0];
    const sentence = story.sentences[nextIndex];

    setPlayingSentence(nextIndex);
    setCurrentSentence(nextIndex);

    const position = sentencePositions.current.get(nextIndex);
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position - 100, animated: true });
    }

    Speech.speak(sentence.german, {
      language: 'de-DE',
      rate: readingSpeed,
      pitch: 1.0,
      onStart: () => {
        audioQueue.current.shift();
        isNavigating.current = false;
      },
      onDone: () => {
        setTimeout(() => {
          playNextSentence();
        }, 500);
      },
      onStopped: () => {
        if (!isNavigating.current) {
          setIsPlaying(false);
          setPlayingSentence(null);
          audioQueue.current = [];
        }
      },
      onError: (error) => {
        console.error('Speech error:', error);
        if (!isNavigating.current) {
          setIsPlaying(false);
          setPlayingSentence(null);
          audioQueue.current = [];
        } else {
          if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
            navigationTimeoutRef.current = null;
          }
          setTimeout(() => {
            if (audioQueue.current.length > 0 && isNavigating.current) {
              playNextSentence();
            }
          }, 100);
        }
      },
    });
  };

  const handlePlayPause = async () => {
    if (!story) return;

    if (isPlaying) {
      isNavigating.current = false;
      await Speech.stop();
      setIsPlaying(false);
      setPlayingSentence(null);
      audioQueue.current = [];
    } else {
      audioQueue.current = Array.from(
        { length: story.sentences.length - currentSentence },
        (_, i) => currentSentence + i
      );
      setIsPlaying(true);
      playNextSentence();
    }
  };

  const handleNavigateChapter = (chapterId: string) => {
    setShowSettings(false);
    navigation.push('Reader', { storyId: chapterId });
  };

  const handlePreviousSentence = async () => {
    if (!story) return;

    const fromSentence = playingSentence ?? currentSentence;
    if (fromSentence > 0 && isPlaying) {
      const newIndex = fromSentence - 1;

      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }

      isNavigating.current = true;
      await Speech.stop();

      audioQueue.current = Array.from(
        { length: story.sentences.length - newIndex },
        (_, i) => newIndex + i
      );

      setCurrentSentence(newIndex);
      setPlayingSentence(newIndex);

      const position = sentencePositions.current.get(newIndex);
      if (position !== undefined && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: position - 100, animated: true });
      }

      navigationTimeoutRef.current = setTimeout(() => {
        navigationTimeoutRef.current = null;
        playNextSentence();
      }, 150);
    }
  };

  const handleNextSentence = async () => {
    if (!story) return;

    const fromSentence = playingSentence ?? currentSentence;
    if (fromSentence < story.sentences.length - 1 && isPlaying) {
      const newIndex = fromSentence + 1;

      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }

      isNavigating.current = true;
      await Speech.stop();

      audioQueue.current = Array.from(
        { length: story.sentences.length - newIndex },
        (_, i) => newIndex + i
      );

      setCurrentSentence(newIndex);
      setPlayingSentence(newIndex);

      const position = sentencePositions.current.get(newIndex);
      if (position !== undefined && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: position - 100, animated: true });
      }

      navigationTimeoutRef.current = setTimeout(() => {
        navigationTimeoutRef.current = null;
        playNextSentence();
      }, 150);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      Speech.stop();
      const finalSentence = currentSentenceRef.current;
      if (finalSentence > 0 && story) {
        updateProgress({
          storyId: story.id,
          sentenceIndex: finalSentence,
          totalSentences: story.sentences.length,
        });
      }
    };
  }, [story, updateProgress]);

  if (loading || !story) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading story...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {story.titleGerman}
        </Text>

        <TouchableOpacity
          onPress={() => setShowSettings(!showSettings)}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.headerButtonText}>⚙</Text>
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
              {germanFirst ? (
                <>
                  <Text
                    style={[
                      styles.germanText,
                      isCurrentlyPlaying && styles.germanTextHighlighted,
                    ]}
                  >
                    {sentence.german}
                  </Text>
                  <Text style={styles.englishText}>{sentence.english}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.englishText}>{sentence.english}</Text>
                  <Text
                    style={[
                      styles.germanText,
                      isCurrentlyPlaying && styles.germanTextHighlighted,
                    ]}
                  >
                    {sentence.german}
                  </Text>
                </>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Controls Bar */}
      <View style={styles.floatingControlsBar}>
        {isPlaying && (
          <TouchableOpacity
            onPress={handlePreviousSentence}
            style={[
              styles.floatingControlButton,
              currentSentence === 0 && styles.floatingControlButtonDisabled,
            ]}
            activeOpacity={0.8}
            disabled={currentSentence === 0}
          >
            <Text
              style={[
                styles.floatingControlButtonText,
                currentSentence === 0 && styles.floatingControlButtonTextDisabled,
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.floatingAudioButton}
          activeOpacity={0.8}
        >
          <Text style={styles.floatingAudioButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        {isPlaying && (
          <TouchableOpacity
            onPress={handleNextSentence}
            style={[
              styles.floatingControlButton,
              currentSentence === story.sentences.length - 1 && styles.floatingControlButtonDisabled,
            ]}
            activeOpacity={0.8}
            disabled={currentSentence === story.sentences.length - 1}
          >
            <Text
              style={[
                styles.floatingControlButtonText,
                currentSentence === story.sentences.length - 1 &&
                  styles.floatingControlButtonTextDisabled,
              ]}
            >
              →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Settings Panel */}
      {showSettings && (
        <View style={styles.settingsOverlay}>
          <TouchableOpacity
            style={styles.settingsBackdrop}
            activeOpacity={1}
            onPress={() => setShowSettings(false)}
          />
          <View style={styles.settingsPanel}>
            <Text style={styles.settingsTitle}>Reader Settings</Text>

            {/* Reading Speed Control */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Reading Speed</Text>
              <View style={styles.settingControl}>
                <TouchableOpacity
                  onPress={() => setReadingSpeed(Math.max(0.5, readingSpeed - 0.1))}
                  style={styles.settingButton}
                >
                  <Text style={styles.settingButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.settingValue}>{readingSpeed.toFixed(1)}x</Text>
                <TouchableOpacity
                  onPress={() => setReadingSpeed(Math.min(1.5, readingSpeed + 0.1))}
                  style={styles.settingButton}
                >
                  <Text style={styles.settingButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Language Order Toggle */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Language Order</Text>
              <View style={styles.settingControl}>
                <TouchableOpacity
                  onPress={() => setGermanFirst(!germanFirst)}
                  style={[styles.toggleButton, germanFirst && styles.toggleButtonActive]}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      germanFirst && styles.toggleButtonTextActive,
                    ]}
                  >
                    German First
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGermanFirst(!germanFirst)}
                  style={[styles.toggleButton, !germanFirst && styles.toggleButtonActive]}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      !germanFirst && styles.toggleButtonTextActive,
                    ]}
                  >
                    English First
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Chapter Navigation */}
            {(previousChapterId || nextChapterId) && (
              <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>Chapter Navigation</Text>
                <View style={styles.navigationControl}>
                  {previousChapterId ? (
                    <TouchableOpacity
                      onPress={() => handleNavigateChapter(previousChapterId)}
                      style={styles.navigationButton}
                    >
                      <Text style={styles.navigationButtonText}>← Previous Chapter</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.navigationButtonDisabled} />
                  )}
                  {nextChapterId ? (
                    <TouchableOpacity
                      onPress={() => handleNavigateChapter(nextChapterId)}
                      style={styles.navigationButton}
                    >
                      <Text style={styles.navigationButtonText}>Next Chapter →</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.navigationButtonDisabled} />
                  )}
                </View>
              </View>
            )}

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowSettings(false)}
              style={styles.settingsCloseButton}
            >
              <Text style={styles.settingsCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  header: {
    height: 56,
    backgroundColor: colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  headerButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 32,
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
  floatingControlsBar: {
    position: 'absolute',
    bottom: spacing.xl * 2,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
  },
  floatingControlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  floatingControlButtonDisabled: {
    backgroundColor: colors.background.secondary,
    opacity: 0.5,
  },
  floatingControlButtonText: {
    fontSize: 24,
    color: colors.text.accent,
  },
  floatingControlButtonTextDisabled: {
    color: colors.text.tertiary,
  },
  floatingAudioButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.interactive.default,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingAudioButtonText: {
    fontSize: 28,
    color: colors.background.primary,
  },
  settingsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  settingsBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 44, 44, 0.5)',
  },
  settingsPanel: {
    backgroundColor: colors.background.elevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: spacing.xl * 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  settingsTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.heading,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  settingSection: {
    marginBottom: spacing.lg,
  },
  settingLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
  },
  settingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: colors.text.accent,
  },
  settingValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.primary,
    minWidth: 60,
    textAlign: 'center',
  },
  toggleButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: colors.interactive.default,
    borderColor: colors.interactive.default,
  },
  toggleButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  toggleButtonTextActive: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.background.primary,
  },
  settingsCloseButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.base,
  },
  settingsCloseButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.body,
    color: colors.text.accent,
  },
  navigationControl: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  navigationButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.interactive.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.body,
    color: colors.background.primary,
  },
  navigationButtonDisabled: {
    flex: 1,
  },
});
