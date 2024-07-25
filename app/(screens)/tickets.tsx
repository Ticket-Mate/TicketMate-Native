import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "react-native-paper";

const TicketsScreen: React.FC = () => {
  return (
    <ThemedView style={styles.container}>
      <Text>Ticket Management Screen</Text>
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

export default TicketsScreen;
