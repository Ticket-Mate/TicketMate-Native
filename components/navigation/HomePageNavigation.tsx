import LoginScreen from "@/app/(screens)/login";
import SignUpScreen from "@/app/(screens)/signup";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "react-native-paper";

export type HomePageStackParamList = {
  Login: typeof LoginScreen;
  Signup: typeof SignUpScreen;
};

const Stack = createStackNavigator<HomePageStackParamList>();

const HomePageNavigation = () => {
  const theme = useTheme();
  return (
    <NavigationContainer independent>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default HomePageNavigation;
