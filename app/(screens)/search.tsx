import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const SearchScreen: React.FC = () => {
  return (
    <ThemedView style={styles.container}>
      <Text variant="headlineSmall">Search Screen</Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchScreen;
