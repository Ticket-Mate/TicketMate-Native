import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { getEventsByUserId } from "../../api/ticket";
import Card from "@/components/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IEvent } from "@/types/event";

const TicketsScreen: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchEventsByUserId(userId);
    }
  }, [userId]);

  const fetchEventsByUserId = async (userId: string) => {
    try {
      setIsLoading(true);
      const fetchedEvents = await getEventsByUserId(userId);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events by user ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEvent = ({ item }: { item: IEvent }) => (
    <Card
      event={item}
      isUserRegister={false} // Change as needed
      onRegisterPress={() => {}}
      ticketCount={item.availableTicket.length} // Assuming you have this data
      showCountdown={true}
      showTicketCount={true}
      showBuyButton={false} // Hide the buy button
      showBellIcon={false} // Hide the bell icon
    />
  );

  return (
    <ThemedView style={styles.container}>
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
});

export default TicketsScreen;
