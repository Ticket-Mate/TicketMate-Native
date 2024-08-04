import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { getEventsByUserId, getTicketCountByEventId } from "../../api/ticket";
import Card from "@/components/Card";
import { IEvent } from "@/types/event";
import { useAuth } from "@/hooks/useAuth";
import { StackNavigationProp } from "@react-navigation/stack";
import { TicketManagementStackParamList } from "@/components/navigation/TicketManagmentNavigation";

interface IEventWithTicketCount extends IEvent {
  ticketCount: number;
}

type TicketManagmentScreenProps = {
  navigation: StackNavigationProp<TicketManagementStackParamList>;
};

const TicketManagmentScreen: React.FC<TicketManagmentScreenProps> = ({
  navigation,
}) => {
  const [events, setEvents] = useState<IEventWithTicketCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      fetchEventsByUserId(user._id);
    }
  }, [user?._id]);

  const fetchEventsByUserId = async (userId: string) => {
    try {
      setIsLoading(true);
      const fetchedEvents = await getEventsByUserId(userId);
      const eventsWithTicketCount = await Promise.all(
        fetchedEvents.map(async (event) => {
          const ticketCount = await getTicketCountByEventId(userId, event._id);
          return { ...event, ticketCount };
        })
      );
      setEvents(eventsWithTicketCount);
    } catch (error) {
      console.error("Error fetching events by user ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventPress = (event: IEventWithTicketCount) => {
    console.log(event._id);
    navigation.navigate("userTicketsDetails", { eventId: event._id });
  };

  const renderEvent = ({ item }: { item: IEventWithTicketCount }) => (
    <TouchableOpacity onPress={() => handleEventPress(item)}>
      <Card
        event={item}
        isUserRegister={false}
        onRegisterPress={() => {}}
        ticketCount={item.ticketCount}
        showCountdown={true}
        showTicketCount={true}
        showBuyButton={false}
        showBellIcon={false}
      />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Ticket Management</Text>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderEvent}
        ListEmptyComponent={<Text>No tickets available.</Text>}
        refreshing={isLoading}
        onRefresh={() => user && fetchEventsByUserId(user._id)}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffff",
  },
});

export default TicketManagmentScreen;
