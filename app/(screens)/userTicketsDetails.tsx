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
import {
  getTicketsByUserAndEventId,
  updateTicketPrice,
  removeTicketFromSale,
} from "../../api/ticket";
import { getEventById } from "../../api/event";
import { IEvent } from "@/types/event";
import { ITicket } from "@/types/ticket";
import { calculateTimeDifference } from "../../utils/timer";
import { useAuth } from "@/hooks/useAuth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { TicketManagementStackParamList } from "@/components/navigation/TicketManagmentNavigation";
import Card from "@/components/Card";
import Ticket from "@/components/Ticket";
import QRCode from "react-native-qrcode-svg";
import Loader from "@/components/Loader";

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
  console.log('eventId', eventId)
  const { user } = useAuth();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [price, setPrice] = useState<string>("");
  const [barcode, setBarcode] = useState<string>("");

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
      if (!event) {
        Alert.alert(
          "Event Not Loaded",
          "Event details are not available. Please try again later."
        );
        return;
      }
      const currentTime = new Date();
      const eventStartTime = new Date(event.startDate);
      const timeDifferenceInHours =
        (eventStartTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
      console.log(timeDifferenceInHours);
      if (timeDifferenceInHours <= 2) {
        Alert.alert(
          "Unable to Sell",
          "Tickets cannot be sold within 2 hours of the event start time."
        );
        return;
      }
      setSelectedTicket(ticket);
      setModalVisible(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const handleRemoveFromSale = async (ticket: ITicket) => {
    Alert.alert(
      "Cancel Sale",
      "Are you sure you want to cancel the sale of this ticket?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await removeTicketFromSale(ticket._id);
              Alert.alert("Success", "Ticket has been removed from sale.");
              if (user) {
                const ticketsList = await getTicketsByUserAndEventId(
                  user._id,
                  eventId
                );
                setTickets(ticketsList);
              }
            } catch (error) {
              console.error("Error removing ticket from sale:", error);
              Alert.alert("Error", "Failed to remove ticket from sale.");
            }
          },
        },
      ]
    );
  };

  const handleUpload = async () => {
    if (!selectedTicket) return;
    // Check if the event data is available

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert(
        "Invalid Price",
        "Please enter a valid price greater than zero."
      );
      return;
    }

    try {
      await updateTicketPrice(selectedTicket._id, price);
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

  const handleBarcodePress = (item: ITicket) => {
    if (!item) {
      console.error("No item passed to handleBarcodePress");
      return;
    }

    const timeDifference = calculateTimeDifference(event?.startDate);

    if (timeDifference > 2) {
      setMessageModalVisible(true);
    } else {
      setBarcode(item.barcode);
      setBarcodeModalVisible(true);
    }
  };

  const renderTicket = ({ item }: { item: ITicket }) => {
    const timeDifference = calculateTimeDifference(event?.startDate);
    const saleLabel = item.onSale
      ? `On Sale: $${item.resalePrice ? item.resalePrice : item.originalPrice}`
      : "List for sale";

    return (
      <View style={styles.ticketCard}>
        <Ticket
          ticket={item}
          onSelect={() => { }}
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
              styles.activeButton,
              timeDifference <= 2 ? styles.activeButton : styles.disabledButton,
            ]}
            onPress={() => {
              console.log("View Barcode button pressed");
              handleBarcodePress(item);
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
      {!isLoading ?
        <>
          {event ? (
            <>
              <Card
                event={event}
                isUserRegister={false}
                showCountdown
                showBuyButton={false}
                formatDate={formatDate}
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

          {/* Modal for uploading ticket for sale */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.modalText}>
                At what price would you like to sell the ticket?
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={setPrice}
                value={price}
                placeholder="Enter Price"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.uploadButtonText}>List for sale</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Modal for displaying QR code */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={barcodeModalVisible}
            onRequestClose={() => {
              setBarcodeModalVisible(!barcodeModalVisible);
            }}
          >
            <View style={styles.qrModalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setBarcodeModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              {event && (
                <Text style={styles.qrModalText}>
                  Ticket to {event.name} barcode:
                </Text>
              )}
              <QRCode value={barcode} size={200} />
            </View>
          </Modal>

          {/* Modal for displaying message when event is more than 2 hours away */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={messageModalVisible}
            onRequestClose={() => {
              setMessageModalVisible(!messageModalVisible);
            }}
          >
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMessageModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Dear customer,</Text>
              <Text style={styles.modalText}>
                The ticket barcode will be available 2 hours before the event.
              </Text>
            </View>
          </Modal>
        </>
        : <Loader />
      }
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
  },
  ticketCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
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
  loadingText: {
    color: "#FFFFFF",
  },
  emptyText: {
    color: "#FFFFFF",
  },
  modalView: {
    marginTop: 60,
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
  qrModalView: {
    marginTop: 60,
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
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  qrModalText: {
    fontSize: 15,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
  },
  uploadButton: {
    backgroundColor: "#9B6AAD",
    padding: 10,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UserTicketsDetailsScreen;
