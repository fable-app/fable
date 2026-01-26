import { View, Text, StyleSheet } from "react-native";

import type { Sentence } from "@fable/core";
import { colors, typography, spacing } from "@fable/design-system";

interface SentenceCardProps {
  sentence: Sentence;
}

export function SentenceCard({ sentence }: SentenceCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.german}>{sentence.german}</Text>
      <Text style={styles.english}>{sentence.english}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.elevated,
    borderRadius: spacing.md,
    padding: 20,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  german: {
    fontFamily: "Literata_400Regular",
    fontSize: typography.sizes.bodyLarge,
    lineHeight: typography.sizes.bodyLarge * typography.lineHeights.loose,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  english: {
    fontFamily: "Literata_400Regular",
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.relaxed,
    color: colors.text.secondary,
  },
});
