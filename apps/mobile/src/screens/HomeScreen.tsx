import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { fetchCurrentPrices, CurrentPricesResponse } from "../services/api";
import { theme } from "../theme";

export const HomeScreen = () => {
  const [data, setData] = useState<CurrentPricesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await fetchCurrentPrices("jaipur");
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    run();
  }, []);

  if (error) {
    return <Text style={styles.error}>Failed to load prices: {error}</Text>;
  }

  if (!data) {
    return <ActivityIndicator color={theme.color.accent} />;
  }

  const price22 = data.prices["22K"];
  const price24 = data.prices["24K"];

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Jaipur Gold Rate</Text>
      <Text style={styles.primaryPrice}>22K ₹{price22.pricePer10g} / 10g</Text>
      <Text style={styles.change}>
        Change: ₹{price22.change} ({price22.changePercent}%)
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>24K Gold</Text>
        <Text style={styles.cardValue}>₹{price24.pricePer10g} / 10g</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today Range</Text>
        <Text style={styles.cardValue}>
          High ₹{data.stats.high} • Low ₹{data.stats.low}
        </Text>
      </View>

      <Text style={styles.meta}>Source: {price22.source}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  eyebrow: {
    color: theme.color.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: "600",
  },
  primaryPrice: {
    color: theme.color.textPrimary,
    fontSize: 34,
    fontWeight: "700",
  },
  change: {
    color: theme.color.success,
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    padding: theme.spacing.md,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  cardTitle: {
    color: theme.color.textSecondary,
    fontSize: 13,
    marginBottom: theme.spacing.xs,
  },
  cardValue: {
    color: theme.color.textPrimary,
    fontSize: 20,
    fontWeight: "600",
  },
  meta: {
    color: theme.color.textMuted,
    fontSize: 12,
  },
  error: {
    color: theme.color.error,
  },
});
