import TicketManagementScreen from "@/app/(screens)/ticketManagement";
import UserTicketsDetailsScreen from "@/app/(screens)/userTicketsDetails";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "react-native-paper";

export type TicketManagementStackParamList = {
  TicketManagement: typeof TicketManagementScreen;
  userTicketsDetails: { eventId: string };
};

const Stack = createStackNavigator<TicketManagementStackParamList>();

const TicketManagementNavigation = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="TicketManagement"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="TicketManagement"
        component={TicketManagementScreen}
      />
      <Stack.Screen
        name="userTicketsDetails"
        component={UserTicketsDetailsScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
export default TicketManagementNavigation;
