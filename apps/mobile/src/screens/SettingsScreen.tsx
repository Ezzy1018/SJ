import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { theme } from "../theme";

export const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Price Alerts</Text>
        <Switch value />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Daily Rate Summary</Text>
        <Switch value />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Special Offers</Text>
        <Switch value />
      </View>
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
    marginBottom: theme.spacing.xs,
  },
  row: {
    minHeight: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: theme.color.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
});
