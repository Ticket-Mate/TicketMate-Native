import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { Searchbar } from 'react-native-paper';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <ThemedView style={styles.container}>
      <Searchbar
        style={{top: 100, width:'90%'}}
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});

export default SearchScreen;
