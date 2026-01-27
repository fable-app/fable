import { useEffect, useRef, useState } from "react";

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
} from "react-native";

import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { StatusBar } from "expo-status-bar";

import { loadStory, getStoryMetadata } from "@fable/core";
import type { Story, Sentence, StoryMetadata } from "@fable/core";
import { colors, typography, spacing } from "@fable/design-system";
import { SafeAreaView } from "react-native-safe-area-context";

import { useStoryProgress } from "@/hooks";

interface BilingualReaderProps {
  story: Story;
}

export function BilingualReader({ story }: BilingualReaderProps) {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const currentSentenceRef = useRef(0);
  const { progress, updateProgress } = useStoryProgress(story.id);
  const sentenceRefs = useRef<Map<number, View>>(new Map());
  const sentencePositions = useRef<Map<number, number>>(new Map());
  const hasScrolledToProgress = useRef(false);

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSentence, setPlayingSentence] = useState<number | null>(null);
  const audioQueue = useRef<number[]>([]);
  const isNavigating = useRef(false); // Track if we're manually navigating
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track navigation timeout

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0.7); // Default reading speed
  const [germanFirst, setGermanFirst] = useState(true); // Language order

  // Chapter navigation
  const [bookMetadata, setBookMetadata] = useState<StoryMetadata | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1);
  const [previousChapterId, setPreviousChapterId] = useState<string | null>(
    null,
  );
  const [nextChapterId, setNextChapterId] = useState<string | null>(null);

  // Configure StatusBar for Android
  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setTranslucent(false);
      RNStatusBar.setBackgroundColor(colors.background.primary);
    }
  }, []);

  // Load book metadata and determine chapter navigation
  useEffect(() => {
    if (story.bookId) {
      const loadBookInfo = async () => {
        const bookData = await loadStory(story.bookId!);
        if (bookData) {
          setBookMetadata(bookData as any);

          // Find current chapter index
          const chapters = (bookData as any).chapters;
          if (chapters) {
            const currentIndex = chapters.findIndex(
              (ch: any) => ch.id === story.id,
            );
            setCurrentChapterIndex(currentIndex);

            // Set previous/next chapter IDs
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
  }, [story.id, story.bookId]);

  // Scroll to last read position on mount
  useEffect(() => {
    if (
      progress &&
      !hasScrolledToProgress.current &&
      sentencePositions.current.size > 0
    ) {
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

  // Update ref whenever currentSentence changes
  useEffect(() => {
    currentSentenceRef.current = currentSentence;
  }, [currentSentence]);

  // Save progress when sentence changes (debounced)
  useEffect(() => {
    if (currentSentence > 0) {
      const timer = setTimeout(() => {
        updateProgress({
          storyId: story.id,
          sentenceIndex: currentSentence,
          totalSentences: story.sentences.length,
        });
      }, 500); // Debounce by 500ms to avoid rapid saves during scrolling

      return () => clearTimeout(timer);
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
      isNavigating.current = false;
      return;
    }

    // Peek at next sentence without removing from queue yet
    const nextIndex = audioQueue.current[0];
    const sentence = story.sentences[nextIndex];

    setPlayingSentence(nextIndex);
    setCurrentSentence(nextIndex); // Update current sentence

    // Scroll to the sentence being read
    const position = sentencePositions.current.get(nextIndex);
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position - 100, animated: true });
    }

    const wasNavigating = isNavigating.current;

    // Speak with German voice
    Speech.speak(sentence.german, {
      language: "de-DE",
      rate: readingSpeed, // User-adjustable reading speed
      pitch: 1.0,
      onStart: () => {
        // Speech started successfully - now we can remove it from queue
        audioQueue.current.shift();
        // Reset navigation flag ONLY after speech successfully starts
        isNavigating.current = false;
      },
      onDone: () => {
        // Add 0.5s pause between sentences
        setTimeout(() => {
          playNextSentence();
        }, 500);
      },
      onStopped: () => {
        // Only reset state if not manually navigating
        if (!isNavigating.current) {
          setIsPlaying(false);
          setPlayingSentence(null);
          audioQueue.current = [];
        } else {
          console.log("[BilingualReader] Skipping reset - still navigating");
        }
      },
      onError: (error) => {
        console.error("[BilingualReader] Speech error:", error);
        console.log(
          "[BilingualReader] Error occurred, isNavigating:",
          isNavigating.current,
        );
        // Only reset state if not navigating
        // Navigation errors are expected when stopping mid-speech
        if (!isNavigating.current) {
          console.log("[BilingualReader] Resetting play state due to error");
          setIsPlaying(false);
          setPlayingSentence(null);
          audioQueue.current = [];
        } else {
          // Cancel the navigation timeout since we're handling playback here
          if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
            navigationTimeoutRef.current = null;
          }
          // During navigation, if speech fails, retry after a short delay
          // Don't shift queue - retry the same sentence
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
    if (isPlaying) {
      // User pressed Pause - stop playback
      isNavigating.current = false; // Clear navigation flag
      await Speech.stop();
      setIsPlaying(false);
      setPlayingSentence(null);
      audioQueue.current = [];
    } else {
      // User pressed Play - start playback
      audioQueue.current = Array.from(
        { length: story.sentences.length - currentSentence },
        (_, i) => currentSentence + i,
      );
      setIsPlaying(true);
      playNextSentence();
    }
  };

  const handleNavigateChapter = (chapterId: string) => {
    setShowSettings(false);
    router.push(`/reader/${chapterId}`);
  };

  const handlePreviousSentence = async () => {
    // Use playingSentence (what's actually being read) not currentSentence (scroll position)
    const fromSentence = playingSentence ?? currentSentence;
    if (fromSentence > 0 && isPlaying) {
      const newIndex = fromSentence - 1;

      // Clear any pending navigation timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }

      // Set navigation flag FIRST to prevent onStopped from resetting state
      isNavigating.current = true;

      // Stop current playback
      await Speech.stop();

      // Build new audio queue from the new sentence
      audioQueue.current = Array.from(
        { length: story.sentences.length - newIndex },
        (_, i) => newIndex + i,
      );

      // Update position
      setCurrentSentence(newIndex);
      setPlayingSentence(newIndex);

      // Scroll to the new sentence
      const position = sentencePositions.current.get(newIndex);
      if (position !== undefined && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: position - 100, animated: true });
      }

      // Wait for speech engine to fully stop before starting new speech
      // Store timeout so we can cancel it if retry happens
      navigationTimeoutRef.current = setTimeout(() => {
        navigationTimeoutRef.current = null;
        playNextSentence();
      }, 150);
    }
  };

  const handleNextSentence = async () => {
    // Use playingSentence (what's actually being read) not currentSentence (scroll position)
    const fromSentence = playingSentence ?? currentSentence;
    if (fromSentence < story.sentences.length - 1 && isPlaying) {
      const newIndex = fromSentence + 1;

      // Clear any pending navigation timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }

      // Set navigation flag FIRST to prevent onStopped from resetting state
      isNavigating.current = true;

      // Stop current playback
      await Speech.stop();

      // Build new audio queue from the new sentence
      audioQueue.current = Array.from(
        { length: story.sentences.length - newIndex },
        (_, i) => newIndex + i,
      );

      // Update position
      setCurrentSentence(newIndex);
      setPlayingSentence(newIndex);

      // Scroll to the new sentence
      const position = sentencePositions.current.get(newIndex);
      if (position !== undefined && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: position - 100, animated: true });
      }

      // Wait for speech engine to fully stop before starting new speech
      // Store timeout so we can cancel it if retry happens
      navigationTimeoutRef.current = setTimeout(() => {
        navigationTimeoutRef.current = null;
        playNextSentence();
      }, 150);
    }
  };

  // Cleanup audio on unmount and save final progress
  useEffect(() => {
    return () => {
      Speech.stop();
      // Save progress on unmount using ref to get the latest value
      const finalSentence = currentSentenceRef.current;
      if (finalSentence > 0) {
        updateProgress({
          storyId: story.id,
          sentenceIndex: finalSentence,
          totalSentences: story.sentences.length,
        });
      }
    };
  }, [story.id, story.sentences.length, updateProgress]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      {/* Simplified Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
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
        showsVerticalScrollIndicator
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
        {/* Previous Sentence Button - Visible when playing */}
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
                currentSentence === 0 &&
                  styles.floatingControlButtonTextDisabled,
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>
        )}

        {/* Play/Pause Button (Center, Always Visible) */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.floatingAudioButton}
          activeOpacity={0.8}
        >
          <Text style={styles.floatingAudioButtonText}>
            {isPlaying ? "⏸" : "▶"}
          </Text>
        </TouchableOpacity>

        {/* Next Sentence Button - Visible when playing */}
        {isPlaying && (
          <TouchableOpacity
            onPress={handleNextSentence}
            style={[
              styles.floatingControlButton,
              currentSentence === story.sentences.length - 1 &&
                styles.floatingControlButtonDisabled,
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
                  onPress={() =>
                    setReadingSpeed(Math.max(0.5, readingSpeed - 0.1))
                  }
                  style={styles.settingButton}
                >
                  <Text style={styles.settingButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.settingValue}>
                  {readingSpeed.toFixed(1)}x
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setReadingSpeed(Math.min(1.5, readingSpeed + 0.1))
                  }
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
                  style={[
                    styles.toggleButton,
                    germanFirst && styles.toggleButtonActive,
                  ]}
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
                  style={[
                    styles.toggleButton,
                    !germanFirst && styles.toggleButtonActive,
                  ]}
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
                      <Text style={styles.navigationButtonText}>
                        ← Previous Chapter
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.navigationButtonDisabled} />
                  )}
                  {nextChapterId ? (
                    <TouchableOpacity
                      onPress={() => handleNavigateChapter(nextChapterId)}
                      style={styles.navigationButton}
                    >
                      <Text style={styles.navigationButtonText}>
                        Next Chapter →
                      </Text>
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
  header: {
    height: 56,
    backgroundColor: colors.background.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  headerButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 32,
    color: colors.text.accent,
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.primary,
    textAlign: "center",
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
    fontFamily: "Literata_400Regular",
    fontSize: typography.sizes.bodyLarge,
    lineHeight: typography.sizes.bodyLarge * typography.lineHeights.loose,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  germanTextHighlighted: {
    color: colors.text.accent,
    fontWeight: "600",
  },
  englishText: {
    fontFamily: "Literata_400Regular",
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.loose,
    color: colors.text.secondary,
  },
  floatingControlsBar: {
    position: "absolute",
    bottom: spacing.xl * 2,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.base,
  },
  floatingControlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.elevated,
    justifyContent: "center",
    alignItems: "center",
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
  floatingControlButtonPlaceholder: {
    width: 56,
    height: 56,
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
    justifyContent: "center",
    alignItems: "center",
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  settingsBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(44, 44, 44, 0.5)",
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
    fontFamily: "Inter_600SemiBold",
    fontSize: typography.sizes.heading,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  settingSection: {
    marginBottom: spacing.lg,
  },
  settingLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  settingControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.base,
  },
  settingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  settingButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    color: colors.text.accent,
  },
  settingValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.primary,
    minWidth: 60,
    textAlign: "center",
  },
  toggleButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  toggleButtonActive: {
    backgroundColor: colors.interactive.default,
    borderColor: colors.interactive.default,
  },
  toggleButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  toggleButtonTextActive: {
    fontFamily: "Inter_600SemiBold",
    color: colors.background.primary,
  },
  settingsCloseButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background.accent,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.base,
  },
  settingsCloseButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: typography.sizes.body,
    color: colors.text.accent,
  },
  navigationControl: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  navigationButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.interactive.default,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: typography.sizes.body,
    color: colors.background.primary,
  },
  navigationButtonDisabled: {
    flex: 1,
  },
});
