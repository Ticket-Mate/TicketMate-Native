import React from "react";
import "react-native-reanimated";
import { theme } from "@/constants/theme";
import { PaperProvider } from "react-native-paper";
import HomePageNavigation from "@/components/navigation/HomePageNavigation";

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <HomePageNavigation />
    </PaperProvider>
  );
}
