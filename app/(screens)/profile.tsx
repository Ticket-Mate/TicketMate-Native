import React from "react";
import { Text } from "react-native-paper";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";


const ProfileScreen: React.FC = () => {
  return (
    <ThemedView style={styles.container}>
      <Text variant="headlineSmall">User Screen</Text>
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

export default ProfileScreen;
