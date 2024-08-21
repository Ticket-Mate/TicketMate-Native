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
import { StripeProvider } from "@stripe/stripe-react-native";

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
      <StripeProvider publishableKey="pk_test_51PpARlP1lUgjHIfufZMNkwl7eqHKjvDAk0J0J5lJnuQVc4yyJ4Xzf1XOle80bPsfNef1Fw8RgPDV0V1NlhQXjRc700qAr4dS84">
      <RootLayout />
      </StripeProvider>
    </AuthProvider>

  );
};

export default App;
