import React, { FC, useEffect, useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Text, Button, IconButton } from "react-native-paper";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { ThemedView } from "@/components/ThemedView";
import { getEvent } from "@/api/event";
import { IEvent } from "../../types/event";
import {ITicket} from "../../types/ticket"

type EventScreenRouteProp = RouteProp<HomePageStackParamList, 'Event'>;

type EventScreenProps = {
    route: EventScreenRouteProp;
    navigation: StackNavigationProp<HomePageStackParamList>;
};

const EventScreen: FC<EventScreenProps> = ({ route, navigation }) => {
    const { eventId } = route.params;
    const [event, setEvent] = useState<IEvent | null>(null);
    const [ticketCount, setTicketCount] = useState(1);

    useEffect(() => {
        const fetchEvent = async () => {
            const eventData = await getEvent(eventId);
            setEvent(eventData);
        };

        fetchEvent();
    }, [eventId]);

    if (!event) {
        return (
            <ThemedView>
                <Text>Loading...</Text>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.headerContainer}>
                    <Image source={{ uri: event.images[0].url }} style={styles.eventImage} />
                    <View style={styles.eventDetailsContainer}>
                        <Text style={styles.eventName}>{event.name}</Text>
                        <Text style={styles.eventLocation}>Palau Sant Jordi, Barcelona</Text>
                        <Text style={styles.eventDate}>{new Date(event.startDate).toLocaleDateString()}</Text>
                    </View>
                </View>
                <View style={styles.ticketCountContainer}>
                    <IconButton icon="minus" onPress={() => setTicketCount(Math.max(1, ticketCount - 1))} />
                    <Text style={styles.ticketCount}>{ticketCount}</Text>
                    <IconButton icon="plus" onPress={() => setTicketCount(ticketCount + 1)} />
                </View>
                {event.availableTicket.map((ticket, index) => (
                    <View key={index} style={styles.ticketRow}>
                        <Text style={styles.ticketText}>Row</Text>
                        <Text style={styles.ticketText}>Seat</Text>
                        <Button mode="contained" style={styles.ticketButton}>Buy Now</Button>
                    </View>
                ))}
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollViewContent: {
        alignItems: 'center',
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    eventImage: {
        width: 115,
        height: 170,
        resizeMode: 'cover',
        marginRight: 16,
        borderRadius: 8,
    },
    eventDetailsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventName: {
        fontSize: 32,
        fontFamily: 'work-sans',
        color: '#fff',
        marginBottom: 12,
        textAlign: 'center',
    },
    eventLocation: {
        fontSize: 16,
        fontFamily: 'work-sans',
        color: '#EBEBF5',
        opacity: 0.6,
        marginBottom: 1,
        textAlign: 'center',
    },
    eventDate: {
        fontSize: 16,
        fontFamily: 'work-sans',
        color: '#EBEBF5',
        opacity: 0.6,
        textAlign: 'center',
    },
    ticketCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ticketCount: {
        fontSize: 18,
        color: '#fff',
        marginHorizontal: 8,
    },
    ticketRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    ticketText: {
        fontSize: 16,
        color: '#fff',
        marginRight: 8,
    },
    ticketButton: {
        marginLeft: 8,
        backgroundColor: '#7c4dff',
    },
});

export default EventScreen;
