//  _layout.tsx

import React, { useEffect } from "react";
import "react-native-reanimated";
import { theme } from "@/constants/theme";
import { Button, PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import HomePageNavigation from "@/components/navigation/HomePageNavigation";
import BottomTabNavigator from "@/components/navigation/BottomTabNavigator";

import { AuthProvider } from "@/context/auth";
import { useAuth } from "@/hooks/useAuth";

function RootLayout() {
  const { user } = useAuth();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer independent={true}>
        {user ? <BottomTabNavigator /> : <HomePageNavigation />}
      </NavigationContainer>
    </PaperProvider>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
};

export default App;
