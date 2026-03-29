import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

export const ChartScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Chart</Text>
      <Text style={styles.body}>
        Wire this screen to /api/prices/history with 1D, 1W, 1M, 3M, 1Y tabs.
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
    lineHeight: 20,
  },
});
