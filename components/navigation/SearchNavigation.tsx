import SearchScreen from "@/app/(screens)/search";
import UserTicketsDetailsScreen from "@/app/(screens)/userTicketsDetails";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "react-native-paper";

export type SearchNavigationStackParamList = {
  Search: typeof SearchScreen;
  userTicketsDetails: { eventId: string };
};

const Stack = createStackNavigator<SearchNavigationStackParamList>();
const SearchNavigation = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Search"
        component={SearchScreen}
      />
      <Stack.Screen
        name="userTicketsDetails"
        component={UserTicketsDetailsScreen}
        options={{
          headerShown: true,
          title: "Event Details",
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
};
export default SearchNavigation;
