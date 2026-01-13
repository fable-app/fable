import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '@/design-system';

export default function ReaderScreen() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reader</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.placeholderText}>
          Reader screen for story: {storyId}
        </Text>
        <Text style={styles.placeholderSubtext}>
          The bilingual reader will be implemented in Phase 1
        </Text>
      </View>
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
  },
  backText: {
    fontFamily: 'Inter_500Medium',
    fontSize: typography.sizes.body,
    color: colors.text.accent,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.primary,
  },
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  placeholderText: {
    fontFamily: 'Inter_500Medium',
    fontSize: typography.sizes.heading,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  placeholderSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.sizes.body * typography.lineHeights.relaxed,
  },
});
