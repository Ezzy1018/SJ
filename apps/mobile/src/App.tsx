import React, { useMemo, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { TabBar, TabKey } from "./components/TabBar";
import { HomeScreen } from "./screens/HomeScreen";
import { ChartScreen } from "./screens/ChartScreen";
import { CollectionScreen } from "./screens/CollectionScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { theme } from "./theme";

const App = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  const Screen = useMemo(() => {
    switch (activeTab) {
      case "chart":
        return <ChartScreen />;
      case "collection":
        return <CollectionScreen />;
      case "settings":
        return <SettingsScreen />;
      case "home":
      default:
        return <HomeScreen />;
    }
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.body}>{Screen}</View>
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  body: {
    flex: 1,
    padding: theme.spacing.md,
  },
});

export default App;
