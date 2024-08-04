import EventScreen from "@/app/(screens)/event";
import HomeScreen from "@/app/(screens)/home";
import LoginScreen from "@/app/(screens)/login";
import SignUpScreen from "@/app/(screens)/signup";
import { useAuth } from "@/hooks/useAuth";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "react-native-paper";

export type HomePageStackParamList = {
  Login: typeof LoginScreen;
  Signup: typeof SignUpScreen;
  Home: typeof HomeScreen;
  Event: { eventId: string };
};

const Stack = createStackNavigator<HomePageStackParamList>();

const HomePageNavigation = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={user ? "Home" : "Login"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Event" component={EventScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};

export default HomePageNavigation;