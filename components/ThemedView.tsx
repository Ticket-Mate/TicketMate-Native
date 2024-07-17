import { View, type ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

export function ThemedView({ ...otherProps }: ViewProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{ backgroundColor: colors.background, flex: 1 }}
      {...otherProps}
    />
  );
}
