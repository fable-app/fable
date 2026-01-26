import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { StoryCollection } from '@/components/StoryCollection';
import { getAllStoryMetadata } from '@fable/core';
import type { StoryMetadata } from '@fable/core';
import { useAllProgress, calculateBookProgress } from '@/hooks';

export default function HomeScreen() {
  const router = useRouter();
  const storyMetadata = getAllStoryMetadata();
  const { progressMap } = useAllProgress();

  // Combine story metadata with real progress
  // For multi-chapter books, calculate average progress across all chapters
  const storiesWithProgress = storyMetadata.map((story: StoryMetadata) => {
    let progress = 0;

    if (story.isMultiChapter && story.chapters) {
      // Calculate average progress across all chapters
      const chapterIds = story.chapters.map(ch => ch.id);
      progress = calculateBookProgress(story.id, chapterIds, progressMap);
    } else {
      // Single story - get progress directly
      progress = progressMap[story.id]?.percentage || 0;
    }

    return {
      ...story,
      progress,
    };
  });

  const handleStoryPress = (storyId: string) => {
    // Check if story is multi-chapter
    const story = storyMetadata.find((s: StoryMetadata) => s.id === storyId);

    if (story?.isMultiChapter) {
      // Navigate to chapter list
      router.push(`/chapters/${storyId}`);
    } else {
      // Navigate directly to reader
      router.push(`/reader/${storyId}`);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <StoryCollection stories={storiesWithProgress} onStoryPress={handleStoryPress} />
    </View>
  );
}
