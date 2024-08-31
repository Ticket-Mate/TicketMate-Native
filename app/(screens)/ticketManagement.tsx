import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { getTicketCountByEventId } from "../../api/ticket";
import { getEventsByUserId } from "../../api/event";
import Card from "@/components/Card";
import { IEvent } from "@/types/event";
import { useAuth } from "@/hooks/useAuth";
import { StackNavigationProp } from "@react-navigation/stack";
import { TicketManagementStackParamList } from "@/components/navigation/TicketManagmentNavigation";
import { useFocusEffect } from "@react-navigation/native";
import { formatDate } from "../../utils/dateFormatter";
import Loader from "@/components/Loader";

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
  useFocusEffect(
    useCallback(() => {
      if (user?._id) {
        fetchEventsByUserId(user._id);
      }
    }, [user?._id])
  );

  const fetchEventsByUserId = async (userId: string) => {
    try {
      setIsLoading(true);
      const fetchedEvents = await getEventsByUserId(userId);
      // Filter out events with "ENDED" status
      const activeEvents = fetchedEvents.filter(
        (event) => event.status !== "ended"
      );

      // Aggregate events by unique ID and sum up ticket counts
      const eventMap: { [key: string]: IEventWithTicketCount } = {};

      for (const event of activeEvents) {
        if (!eventMap[event._id]) {
          const ticketCount = await getTicketCountByEventId(userId, event._id);
          eventMap[event._id] = { ...event, ticketCount };
        } else {
          const ticketCount = await getTicketCountByEventId(userId, event._id);
          eventMap[event._id].ticketCount = ticketCount;
        }
      }

      const eventsWithTicketCount = Object.values(eventMap);
      setEvents(eventsWithTicketCount);
    } catch (error) {
      console.error("Error fetching events by user ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventPress = (event: IEventWithTicketCount) => {
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
        formatDate={formatDate}
      />
    </TouchableOpacity>
  );

  return (
    
    <ThemedView style={styles.container}>
      {!isLoading ?
      <>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderEvent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You don't have any tickets yet. Start exploring events and grab
              your first ticket!
            </Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={() => user && fetchEventsByUserId(user._id)}
      />
      </> : <Loader/>}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
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
