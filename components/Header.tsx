import React, { FC } from "react";
import { Image, StyleSheet, SafeAreaView } from "react-native";
import { Text, useTheme } from "react-native-paper";

const Header: FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={require('../assets/images/logo.png')} />
      <Text variant="displaySmall" style={styles.text}>
        Ticket Mate
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
  },
  logo: {
    width: 150,
    height: 80,
  },
  text: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "700",    
  },
});

export default Header;
