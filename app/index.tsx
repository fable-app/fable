import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '@/design-system';
import { getAllStoryMetadata } from '@/services/story.service';

export default function HomeScreen() {
  const router = useRouter();
  const stories = getAllStoryMetadata();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fable</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.welcomeText}>German Stories</Text>
        <Text style={styles.subtitleText}>
          {stories.length} {stories.length === 1 ? 'story' : 'stories'} available
        </Text>

        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyCard}
            onPress={() => router.push(`/reader/${story.id}`)}
          >
            <Text style={styles.storyTitleGerman}>{story.titleGerman}</Text>
            <Text style={styles.storyTitleEnglish}>{story.titleEnglish}</Text>
            <View style={styles.storyMeta}>
              <Text style={styles.storyMetaText}>{story.author}</Text>
              <Text style={styles.storyMetaText}> · </Text>
              <Text style={styles.storyMetaText}>{story.wordCount} words</Text>
              <Text style={styles.storyMetaText}> · </Text>
              <Text style={styles.storyMetaText}>{story.difficulty}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.infoText}>
          Tap any story to start reading. Full StoryCollection component with progress tracking coming in PR #3.
        </Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  welcomeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.display,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacing.tighter,
  },
  subtitleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: typography.sizes.body * typography.lineHeights.relaxed,
  },
  storyCard: {
    backgroundColor: colors.background.elevated,
    padding: spacing.base + 4,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  storyTitleGerman: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.heading,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  storyTitleEnglish: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyMetaText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.bodySmall,
    color: colors.text.tertiary,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.bodySmall,
    color: colors.text.tertiary,
    lineHeight: typography.sizes.bodySmall * typography.lineHeights.relaxed,
    marginTop: spacing.lg,
  },
});
