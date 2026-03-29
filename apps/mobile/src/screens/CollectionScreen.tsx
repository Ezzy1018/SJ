import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

export const CollectionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collection</Text>
      <Text style={styles.body}>
        Phase 1 placeholder for top products + store card.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.color.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
  body: {
    color: theme.color.textSecondary,
    fontSize: 14,
  },
});
