import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { StoryCollection } from '@/components/StoryCollection';
import { getAllStoryMetadata } from '@/services/story.service';
import type { StoryMetadata } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const storyMetadata = getAllStoryMetadata();

  // Mock progress data for PR #3
  // Real progress tracking will come in PR #4
  const mockProgress: Record<string, number> = {
    'story-01': 0,           // Not started
    'story-02': 42,          // In progress
    'story-03': 100,         // Completed
  };

  // Combine story metadata with mock progress
  const storiesWithProgress = storyMetadata.map((story: StoryMetadata) => ({
    ...story,
    progress: mockProgress[story.id] || 0,
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
