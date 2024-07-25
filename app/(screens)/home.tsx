import React, { useEffect, useState } from 'react';
import { FlatList, Alert, StyleSheet } from 'react-native';
import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { ThemedView } from "@/components/ThemedView";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button, Text } from "react-native-paper";
import Card from '@/components/Card';
import { getEvents } from '../../api/event';
import { IEvent } from '@/types/event';
import { getUserNotificationsRegistration, registerUserForEventNotification, unregisterUserFromEventNotification } from '@/api/notification';
import { INotification } from '@/types/notification';
import { useAuth } from '@/hooks/useAuth';
import { RefreshControl } from 'react-native-gesture-handler';

type HomeScreenProps = {
    navigation: StackNavigationProp<HomePageStackParamList>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { user, handleLogout } = useAuth();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [events, setEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        if (user) {
            Promise.all([fetchEvents(), fetchUserNotificationData()]);
        }
    }, [user]);

    const fetchEvents = async () => {
        try {
            const fetchedEvents = await getEvents();
            setEvents(fetchedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
            Alert.alert('Error', 'Failed to fetch events. Please try again.');
        }
    };

    const fetchUserNotificationData = async () => {
        try {
            const data = await getUserNotificationsRegistration(user?._id!)
            setNotifications(data)
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    }

    const handleRegisterNotification = async (eventId: string, register: boolean) => {
        try {
            if (register) {
                await registerUserForEventNotification(user?._id!, eventId);
            } else {
                await unregisterUserFromEventNotification(user?._id!, eventId);
            }
            await fetchUserNotificationData();
        } catch (error) {
            console.error('Error handling notification:', error);
        }
    };

    const handleBuyTicket = (eventId: string) => {
        // TODO: implement this logic
    };

    return (
        <ThemedView style={styles.container}>
            <Text style={styles.title}>TicketMate</Text>
            <Text>Hello, {user?.firstName}</Text>
            <FlatList
                data={events}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const isUserRegistered = notifications.some(notification => notification.eventId == item._id);
                    return (
                        <Card
                            event={item}
                            isUserRegister={isUserRegistered}
                            onRegisterPress={() => handleRegisterNotification(item._id, !isUserRegistered)}
                            onBuyTicket={() => handleBuyTicket(item._id)}
                        />
                    );
                }}
            />
            <Button onPress={handleLogout}>LogOut</Button>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor: 'black',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'rgb(155, 106, 173)',
        textAlign: 'center',
    },
});

export default HomeScreen;