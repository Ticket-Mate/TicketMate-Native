import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { getTicketsByUserAndEventId, updateTicketPrice, removeTicketFromSale } from "../../api/ticket";
import { getEventById } from "../../api/event";
import { IEvent } from "@/types/event";
import { ITicket } from "@/types/ticket";
import { calculateTimeDifference } from "../../utils/timer";
import { useAuth } from "@/hooks/useAuth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { TicketManagementStackParamList } from "@/components/navigation/TicketManagmentNavigation";
import Card from "@/components/Card"; // Ensure this path is correct
import Ticket from "@/components/Ticket";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [price, setPrice] = useState<string>("");

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

  const handleUploadForSale = (ticket: ITicket, label: string) => {
    if (label.includes("On Sale")) {
      handleRemoveFromSale(ticket);
    } else {
      setSelectedTicket(ticket);
      setModalVisible(true);
    }
  };

  const handleRemoveFromSale = async (ticket: ITicket) => {
    // Logic for removing from sale
    try {
      await removeTicketFromSale(ticket._id);
      Alert.alert("Success", "Ticket has been removed from sale.");
      // Optionally refresh the tickets list
      if (user) {
        const ticketsList = await getTicketsByUserAndEventId(user._id, eventId);
        setTickets(ticketsList);
      }
    } catch (error) {
      console.error("Error removing ticket from sale:", error);
      Alert.alert("Error", "Failed to remove ticket from sale.");
    }
  };

  const handleUpload = async () => {
    if (!selectedTicket) return;
    try {
      const updatedTicket = await updateTicketPrice(selectedTicket._id, price);
      setModalVisible(false);
      Alert.alert("Success", "Ticket has been uploaded for sale.");
      if (user) {
        const ticketsList = await getTicketsByUserAndEventId(user._id, eventId);
        setTickets(ticketsList);
      }
    } catch (error) {
      console.error("Error uploading ticket for sale:", error);
      Alert.alert("Error", "Failed to upload ticket for sale.");
    }
  };

  const renderTicket = ({ item }: { item: ITicket }) => {
    const timeDifference = calculateTimeDifference(event?.startDate);
    const saleLabel = item.onSale ? `On Sale: $${item.resalePrice ? item.resalePrice : item.originalPrice}` : "Upload for Sale";

    return (
      <View style={styles.ticketCard}>
        <Ticket
          ticket={item}
          onSelect={() => {}}
          selected={false}
          includeCheckbox={false}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saleButton}
            onPress={() => handleUploadForSale(item, saleLabel)}
          >
            <Text style={styles.saleButtonText}>{saleLabel}</Text>
          </TouchableOpacity>
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
        </>
      ) : (
        <Text style={styles.loadingText}>Loading event details...</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>At what price would you like to sell the ticket?</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPrice}
            value={price}
            placeholder="Enter Price"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
          >
            <Text style={styles.uploadButtonText}>Upload for Sale</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    backgroundColor: "#508D4E",
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: "#636366",
    borderRadius: 20,
  },
  ticketButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  saleButton: {
    backgroundColor: "#9B6AAD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  saleButtonText: {
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    width: "80%",
    paddingLeft: 10,
  },
  uploadButton: {
    backgroundColor: "#9B6AAD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UserTicketsDetailsScreen;
