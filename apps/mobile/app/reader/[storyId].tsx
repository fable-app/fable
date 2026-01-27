import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { colors, typography, spacing } from "@fable/design-system";

import { BilingualReader } from "@/components";
import { useStory } from "@/hooks";

export default function ReaderScreen() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const { story, loading, error } = useStory(storyId);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.interactive.default} />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  if (error || !story) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load story</Text>
        <Text style={styles.errorSubtext}>
          {error?.message || "Story not found"}
        </Text>
      </View>
    );
  }

  return <BilingualReader story={story} />;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  loadingText: {
    fontFamily: "Inter_400Regular",
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginTop: spacing.base,
  },
  errorText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: typography.sizes.heading,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  errorSubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    textAlign: "center",
  },
});
