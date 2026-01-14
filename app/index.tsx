import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { StoryCollection } from '@/components/StoryCollection';
import { getAllStoryMetadata } from '@/services/story.service';
import { useAllProgress } from '@/hooks';
import type { StoryMetadata } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const storyMetadata = getAllStoryMetadata();
  const { progressMap } = useAllProgress();

  // Combine story metadata with real progress from SQLite
  const storiesWithProgress = storyMetadata.map((story: StoryMetadata) => ({
    ...story,
    progress: progressMap[story.id]?.percentage || 0,
  }));

  const handleStoryPress = (storyId: string) => {
    router.push(`/reader/${storyId}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <StoryCollection stories={storiesWithProgress} onStoryPress={handleStoryPress} />
    </View>
  );
}
