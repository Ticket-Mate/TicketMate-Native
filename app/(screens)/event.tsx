import React, { FC, useEffect, useState } from "react";
import { View, Image, StyleSheet, ScrollView, Button, Alert, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import Dialog from "react-native-dialog";
import CheckBox from 'expo-checkbox';
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { ThemedView } from "@/components/ThemedView";
import { getEventById } from "@/api/event";
import { IEvent } from "../../types/event";
import { useAuth } from "@/hooks/useAuth";
import { ITicket } from "../../types/ticket";
import { purchaseTickets } from "@/api/ticket"; // Import the new API request
import Ticket from "../../components/Ticket";

type EventScreenRouteProp = RouteProp<HomePageStackParamList, "Event">;

type EventScreenProps = {
  route: EventScreenRouteProp;
  navigation: StackNavigationProp<HomePageStackParamList>;
};

const EventScreen: FC<EventScreenProps> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<ITicket[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      const eventData = await getEventById(eventId);
      setEvent(eventData);
    };

    fetchEvent();
  }, [eventId]);

  const handleSelectTicket = (ticket: ITicket, selected: boolean) => {
    setSelectedTickets((prevSelected) => {
      if (selected) {
        return [...prevSelected, ticket];
      } else {
        return prevSelected.filter((t) => t._id !== ticket._id);
      }
    });
  };

  const handleBuyTickets = () => {
    setDialogVisible(true);
  };

  const handlePayment = async () => {
    let missingFields = [];
    if (!cardName) missingFields.push("Card name");
    if (!cardNumber) missingFields.push("Card number");
    if (!expiryDate) missingFields.push("Expiry date");
    if (!cvv) missingFields.push("CVV");
    if (!agreeToTerms) missingFields.push("Agreement to Terms and Conditions");
  
    if (missingFields.length > 0) {
      Alert.alert("Missing Information", `Please fill out the following fields: ${missingFields.join(", ")}`);
      return;
    }
  
    if (!user || !user._id) {
      Alert.alert("User not authenticated", "Please log in to complete the purchase.");
      return;
    }
  
    try {
      await purchaseTickets(user._id, selectedTickets.map(ticket => ticket._id));
      Alert.alert("Payment Successful", `You have paid for ${selectedTickets.length} tickets.`, [
        { text: "OK", onPress: () => {
            setDialogVisible(false);
            navigation.replace("Event", { eventId }); // Reload the event page
          }
        }
      ]);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Payment Failed", error.message);
      } else {
        Alert.alert("Payment Failed", "An unknown error occurred.");
      }
    }
  };

  const totalPrice = selectedTickets.reduce((sum, ticket) => sum + (ticket.resalePrice ?? ticket.originalPrice), 0);

  if (!event) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: event.images[0].url }}
          style={styles.eventImage}
        />
        <View style={styles.eventDetailsContainer}>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventLocation}>
            Palau Sant Jordi, Barcelona
          </Text>
          <Text style={styles.eventDate}>
            {new Date(event.startDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.ticketsContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {(event.availableTicket as ITicket[]).map((ticket, index) => (
            <Ticket
              key={index}
              ticket={ticket}
              onSelect={handleSelectTicket}
              selected={selectedTickets.includes(ticket)}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Selected Tickets: {selectedTickets.length}
        </Text>
        <Button
          title="Buy Tickets"
          onPress={handleBuyTickets}
        />
      </View>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Payment</Dialog.Title>
        <Dialog.Description>
          You are about to pay for {selectedTickets.length} tickets. The total amount is ${totalPrice}.
        </Dialog.Description>
        <Dialog.Input
          placeholder="Card name"
          value={cardName}
          onChangeText={setCardName}
        />
        <Dialog.Input
          placeholder="Card number"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <Dialog.Input
          placeholder="Expiry date"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <Dialog.Input
          placeholder="CVV"
          keyboardType="numeric"
          value={cvv}
          onChangeText={setCvv}
        />
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={agreeToTerms}
            onValueChange={setAgreeToTerms}
          />
          <Text style={styles.checkboxLabel}>I agree to the Terms and Conditions</Text>
        </View>
        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Pay" onPress={handlePayment} />
      </Dialog.Container>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#fff",
  },
  scrollViewContent: {
    padding: 16,
  },
  headerContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  eventImage: {
    width: 115,
    height: 170,
    resizeMode: "cover",
    marginRight: 16,
    borderRadius: 8,
  },
  eventDetailsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  eventName: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  eventLocation: {
    fontSize: 16,
    color: "#EBEBF5",
    opacity: 0.6,
    marginBottom: 1,
    textAlign: "center",
  },
  eventDate: {
    fontSize: 16,
    color: "#EBEBF5",
    opacity: 0.6,
    textAlign: "center",
  },
  ticketsContainer: {
    flex: 1,
    width: "100%",
    maxHeight: "70%", // Shorten the ticket scrollable section
  },
  footer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
  },
  footerText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "black",
  },
});

export default EventScreen;
