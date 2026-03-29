import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

export type TabKey = "home" | "chart" | "collection" | "settings";

interface Props {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "chart", label: "Chart" },
  { key: "collection", label: "Collection" },
  { key: "settings", label: "Settings" },
];

export const TabBar = ({ activeTab, onChange }: Props) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active && styles.activeTab]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.color.surface,
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: theme.color.raised,
  },
  label: {
    color: theme.color.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  activeLabel: {
    color: theme.color.accent,
  },
});
