import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { getEventsByUserId, getTicketCountByEventId } from "../../api/ticket";
import Card from "@/components/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IEvent } from "@/types/event";
import { useAuth } from "@/hooks/useAuth";

interface IEventWithTicketCount extends IEvent {
  ticketCount: number;
}

const TicketsScreen: React.FC = () => {
  const [events, setEvents] = useState<IEventWithTicketCount[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
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

  const renderEvent = ({ item }: { item: IEventWithTicketCount }) => (
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
        onRefresh={() => userId && fetchEventsByUserId(userId)}
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

export default TicketsScreen;
