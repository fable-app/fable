import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, semanticColors, typography, spacing } from '@fable/design-system';
import { loadStory } from '@fable/core';
import type { StoryMetadata, ChapterMetadata } from '@fable/core';
import { useAllProgress } from '@/hooks';

export default function ChapterListScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const [bookMetadata, setBookMetadata] = useState<StoryMetadata | null>(null);
  const { progressMap, refreshProgress } = useAllProgress();

  // Configure StatusBar for Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(false);
      RNStatusBar.setBackgroundColor(colors.background.primary);
    }
  }, []);

  // Refresh progress when screen comes into focus (e.g., when returning from reader)
  useFocusEffect(
    useCallback(() => {
      const doRefresh = async () => {
        // Wait for debounced saves to complete (500ms debounce + 200ms buffer)
        await new Promise(resolve => setTimeout(resolve, 700));
        await refreshProgress();
      };
      doRefresh();
    }, [refreshProgress])
  );

  useEffect(() => {
    async function loadBookData() {
      if (!bookId) return;
      const data = await loadStory(bookId);
      if (data) {
        setBookMetadata(data as any);
        // Refresh progress when book loads
        await refreshProgress();
      }
    }
    loadBookData();
  }, [bookId, refreshProgress]);


  const handleChapterPress = (chapterId: string) => {
    router.push(`/reader/${chapterId}`);
  };

  if (!bookMetadata || !bookMetadata.isMultiChapter) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Text style={styles.errorText}>Book not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {bookMetadata.titleGerman}
          </Text>
          <Text style={styles.headerSubtitle}>
            {bookMetadata.chapterCount} Kapitel
          </Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Chapter List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {bookMetadata.chapters?.map((chapter: ChapterMetadata, index: number) => {
          const chapterProgress = progressMap[chapter.id]?.percentage || 0;
          const isCompleted = chapterProgress === 100;
          const isStarted = chapterProgress > 0 && chapterProgress < 100;

          return (
            <TouchableOpacity
              key={chapter.id}
              style={styles.chapterCard}
              onPress={() => handleChapterPress(chapter.id)}
              activeOpacity={0.7}
            >
              <View style={styles.chapterHeader}>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterNumber}>
                    Kapitel {chapter.chapterNumber}
                  </Text>
                  <Text style={styles.chapterTitle} numberOfLines={2}>
                    {chapter.titleGerman}
                  </Text>
                  <Text style={styles.chapterSubtitle} numberOfLines={1}>
                    {chapter.titleEnglish}
                  </Text>
                </View>

                <View style={styles.chapterMeta}>
                  <Text style={styles.wordCount}>
                    {chapter.wordCount} words
                  </Text>
                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>✓</Text>
                    </View>
                  )}
                  {isStarted && !isCompleted && (
                    <View style={styles.inProgressBadge}>
                      <Text style={styles.inProgressText}>{Math.round(chapterProgress)}%</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Progress bar - always visible */}
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${chapterProgress}%`,
                      backgroundColor: isCompleted ? colors.progress.complete : colors.progress.fill,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    height: 80,
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.small,
    color: colors.text.secondary,
    marginTop: 2,
  },
  placeholder: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.base,
  },
  chapterCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chapterInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  chapterNumber: {
    fontFamily: 'Inter_500Medium',
    fontSize: typography.sizes.small,
    color: colors.text.accent,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chapterTitle: {
    fontFamily: 'Literata_500Medium',
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.primary,
    marginBottom: 4,
  },
  chapterSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  chapterMeta: {
    alignItems: 'flex-end',
  },
  wordCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.small,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  completedBadge: {
    backgroundColor: semanticColors.success,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.background.primary,
  },
  inProgressBadge: {
    backgroundColor: colors.progress.fill, // Dusty rose for in-progress
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inProgressText: {
    fontFamily: 'Inter_500Medium',
    fontSize: typography.sizes.small,
    color: colors.background.primary,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.progress.track,
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    // backgroundColor set inline based on completion status
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl * 2,
  },
});
