import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { getTicketsByUserAndEventId } from "../../api/ticket";
import { getEventById } from "../../api/event";
import { IEvent } from "@/types/event";
import { ITicket } from "@/types/ticket";
import { calculateTimeDifference } from "../../utils/timer";
import { useAuth } from "@/hooks/useAuth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { TicketManagementStackParamList } from "@/components/navigation/TicketManagmentNavigation";
import Card from "@/components/Card"; // Ensure this path is correct

type UserTicketsDetailsScreenRouteProps = RouteProp<
  TicketManagementStackParamList,
  "userTicketsDetails"
>;

type UserTicketsDetailsScreenProps = {
  route: UserTicketsDetailsScreenRouteProps;
  navigation: StackNavigationProp<TicketManagementStackParamList>;
};

const UserTicketsDetailsScreen: React.FC<UserTicketsDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { eventId } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        const eventDetails = await getEventById(eventId);
        setEvent(eventDetails);

        if (user) {
          const ticketsList = await getTicketsByUserAndEventId(
            user._id,
            eventId
          );
          setTickets(ticketsList);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, user]);

  const renderTicket = ({ item }: { item: ITicket }) => {
    const timeDifference = calculateTimeDifference(event?.startDate);

    return (
      <View style={styles.ticketCard}>
        <Text style={styles.ticketPosition}>Position: {item.position}</Text>
        <Text style={styles.ticketText}>Resale Price: {item.resalePrice}</Text>
        <Text style={styles.ticketText}>Barcode: {item.barcode}</Text>
        <View style={styles.buttonContainer}>
          {item.onSale ? (
            <Text style={styles.onSaleText}>On Sale: ${item.resalePrice}</Text>
          ) : (
            <Button
              title="Upload for Sale"
              onPress={() => {
                /* Handle upload for sale */
              }}
            />
          )}
          <TouchableOpacity
            style={[
              styles.ticketButton,
              timeDifference <= 2 ? styles.activeButton : styles.disabledButton,
            ]}
            disabled={timeDifference > 2}
            onPress={() => {
              /* Handle barcode view */
            }}
          >
            <Text style={styles.ticketButtonText}>View Barcode</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <Text style={styles.loadingText}>Loading user details...</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {event ? (
        <>
          <Card
            event={event}
            isUserRegister={false} // or any logic to determine this
            showCountdown
            showBuyButton={false}
          />
          <FlatList
            data={tickets}
            keyExtractor={(item) => item._id}
            renderItem={renderTicket}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No tickets available for this event.
              </Text>
            }
            refreshing={isLoading}
          />
          <Button
            title="Sell Ticket"
            onPress={() => {
              /* Navigate to ticket upload screen */
            }}
          />
        </>
      ) : (
        <Text style={styles.loadingText}>Loading event details...</Text>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000", // Ensure the background color contrasts with the text
  },
  ticketCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
  },
  ticketPosition: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  ticketText: {
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ticketButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: "#007bff",
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
  },
  ticketButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  onSaleText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loadingText: {
    color: "#FFFFFF",
  },
  emptyText: {
    color: "#FFFFFF",
  },
});

export default UserTicketsDetailsScreen;
