import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface NavigationLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

const NavigationLink: FC<NavigationLinkProps> = ({
  onPress,
  text,
  linkText,
}) => {
  const { colors } = useTheme();

  return (
    <Text onPress={onPress}>
      {text}{" "}
      <Text style={[styles.text, { color: colors.primary }]}>{linkText}</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "700",
  },
});

export default NavigationLink;
