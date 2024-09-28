import SearchScreen from "@/app/(screens)/search";
import EventScreen from "@/app/(screens)/event";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "react-native-paper";

export type SearchNavigationStackParamList = {
  Search: typeof SearchScreen;
  Event: { eventId: string };
};

const Stack = createStackNavigator<SearchNavigationStackParamList>();
const SearchNavigation = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: 'black', 
      }}
    >
      <Stack.Screen
        name="Search"
        component={SearchScreen}
      />
      <Stack.Screen
        name="Event"
        component={EventScreen}
        options={{
          headerShown: true,
          title: "Event Details",
        }}
      />
    </Stack.Navigator>
  );
};
export default SearchNavigation;
