import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

const Header: FC = () => {
  const { colors } = useTheme();

  return (
    <Text
      variant="displayMedium"
      style={[styles.text, { color: colors.primary }]}
    >
      ProFinder
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    marginTop: 100,
    fontWeight: "700",
  },
});

export default Header;
