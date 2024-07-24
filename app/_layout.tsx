import React from "react";
import "react-native-reanimated";
import { theme } from "@/constants/theme";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import HomePageNavigation from "@/components/navigation/HomePageNavigation";
import BottomTabNavigator from "@/components/navigation/BottomTabNavigator";
import useUser from "@/hooks/useUser";

export default function RootLayout() {
  const { user } = useUser();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer independent={true}>
        {user ? <BottomTabNavigator /> : <HomePageNavigation />}
      </NavigationContainer>
    </PaperProvider>
  );
}
