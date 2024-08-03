import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { ThemedView } from "@/components/ThemedView";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FC } from "react";
import { Text } from "react-native-paper";


type EventScreenRouteProp = RouteProp<HomePageStackParamList, 'Event'>;


type EventScreenProps = {
    route: EventScreenRouteProp;
    navigation: StackNavigationProp<HomePageStackParamList>;
};

const EventScreen: FC<EventScreenProps> = ({ route, navigation }) => {
    const { eventId } = route.params;
    return (
        <ThemedView>
            <Text>Test Screen with param: {eventId}</Text>
        </ThemedView>
    );
}
export default EventScreen;