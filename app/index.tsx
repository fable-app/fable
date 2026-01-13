import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '@/design-system';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fable</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.welcomeText}>Welcome to Fable</Text>
        <Text style={styles.subtitleText}>Learn German through beautiful stories</Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Phase 0: Foundation Complete! ✓</Text>
          <Text style={styles.statusItem}>✓ Expo project initialized</Text>
          <Text style={styles.statusItem}>✓ Design system implemented</Text>
          <Text style={styles.statusItem}>✓ TypeScript configured</Text>
          <Text style={styles.statusItem}>✓ Expo Router ready</Text>
          <Text style={styles.statusItem}>⏳ Story content processing...</Text>
        </View>

        <Text style={styles.infoText}>
          This is a test screen to verify the app runs correctly.
          The full story collection and reader will be built in Phase 1.
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
  statusCard: {
    backgroundColor: colors.background.elevated,
    padding: spacing.base + 4,
    borderRadius: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statusTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.sizes.heading,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statusItem: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: typography.sizes.body * typography.lineHeights.relaxed,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.sizes.bodySmall,
    color: colors.text.tertiary,
    lineHeight: typography.sizes.bodySmall * typography.lineHeights.relaxed,
  },
});
