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
import { purchaseTickets,emailTicketReceipt,emailToSeller } from "@/api/ticket";
import { registerUserForEventNotification, unregisterUserFromEventNotification, getUserNotificationsRegistration } from "@/api/notification";
import Ticket from "../../components/Ticket";
import { INotification } from "@/types/notification";
import apiClient from "../../api/apiClient"; 
import { useStripe } from '@stripe/stripe-react-native';
import { fetchPaymentSheetParams } from "@/api/payment";

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
  const [includeCheckbox, setIncludeCheckbox] = useState(true);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); 

  useEffect(() => {
    const fetchEvent = async () => {
      const eventData = await getEventById(eventId);
      setEvent(eventData);
    };

    const fetchUserNotificationData = async () => {
      try {
        const data = await getUserNotificationsRegistration(user?._id!);
        setNotifications(data);
        setIsUserRegistered(data.some(notification => notification.eventId === eventId));
      } catch (error) {
        console.error('Error fetching notification data:', error);
      }
    };

    fetchEvent();
    fetchUserNotificationData();
  }, [eventId, user]);

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
    if (!agreeToTerms) {
      Alert.alert("Agreement Required", "You must agree to the terms and conditions to proceed.");
      return;
    }
  
    if (!user || !user._id) {
      Alert.alert("User not authenticated", "Please log in to complete the purchase.");
      return;
    }
  
    // Ensure the amount is correct and in cents
    const totalPriceInCents = Math.round(totalPrice * 100);
  
    try {
      // Fetch the payment sheet parameters
      const paymentSheetParams = await fetchPaymentSheetParams(totalPriceInCents, user.email);
      
      
  
      if (!paymentSheetParams) {
        return;
      }
  
      const { clientSecret,paymentIntentId } = paymentSheetParams;
  
      // Initialize the payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'TicketMate',  
        paymentIntentClientSecret: clientSecret,
      });
  
      if (initError) {
        Alert.alert("Payment Initialization Error", initError.message);
        return;
      }
  
      // Present the payment sheet to the user
      const { error: presentError } = await presentPaymentSheet();
  
      if (presentError) {
        Alert.alert("Payment Error", presentError.message);
      } else {
        // Payment was successful
        try {
          await purchaseTickets(user._id, selectedTickets.map(ticket => ticket._id));
          Alert.alert("Payment Successful", `You have paid for ${selectedTickets.length} tickets.`, [
            {
              text: "OK", onPress: () => {
                emailTicketReceipt(user._id, paymentIntentId); // Call the function here
                emailToSeller(selectedTickets)
                setDialogVisible(false);
                navigation.replace("Event", { eventId });
              }
            }
          ]);
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert("Ticket Purchase Failed", error.message);
          } else {
            Alert.alert("Ticket Purchase Failed", "An unknown error occurred.");
          }
        }
      }
    } catch (error) {
      Alert.alert("Payment Error", "An error occurred during payment.");
      console.error("Payment error:", error);
    }
  };


  

  

  const handleRegisterNotification = async (register: boolean) => {
    try {
      if (register) {
        await registerUserForEventNotification(user?._id!, eventId);
      } else {
        await unregisterUserFromEventNotification(user?._id!, eventId);
      }
      setIsUserRegistered(register);
    } catch (error) {
      console.error('Error handling notification:', error);
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

  const availableTickets = (event.availableTicket as ITicket[]).filter(
    ticket => ticket.ownerId !== user?._id
  );
  
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
          {event.location}
        </Text>
        <Text style={styles.eventDate}>
          {new Date(event.startDate).toLocaleDateString()}{" "}
          {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      </View>
      <View style={styles.ticketsContainer}>
        {availableTickets.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {availableTickets.map((ticket, index) => (
              <Ticket
                key={index}
                ticket={ticket}
                onSelect={handleSelectTicket}
                selected={selectedTickets.includes(ticket)}
                includeCheckbox={includeCheckbox}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noTicketsContainer}>
            <Text style={styles.noTicketsText}>No available tickets for this event currently.</Text>
            <Button
              title={isUserRegistered ? "Unregister from Notification" : "Register for Notification"}
              onPress={() => handleRegisterNotification(!isUserRegistered)}
            />
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Selected Tickets: {selectedTickets.length}
        </Text>
        <Button
          title="Buy Tickets"
          onPress={handleBuyTickets}
          disabled={selectedTickets.length === 0}
        />
      </View>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Payment</Dialog.Title>
        <Dialog.Description>
          You are about to pay for {selectedTickets.length} tickets. The total amount is ${totalPrice}.
        </Dialog.Description>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={agreeToTerms}
            onValueChange={setAgreeToTerms}
          />
          <Dialog.Description>
          I agree to the Terms and Conditions
          </Dialog.Description>
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
  noTicketsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTicketsText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
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
