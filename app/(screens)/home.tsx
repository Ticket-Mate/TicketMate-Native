import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, Alert, StyleSheet, View } from 'react-native';
import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { ThemedView } from "@/components/ThemedView";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text } from "react-native-paper";
import Card from '@/components/Card';
import CategoryTabs from '@/components/CategoryTabs';
import TrendingEventsCarousel from '@/components/TrendingEventsCarousel';
import LastMinuteDeals from '@/components/LastMinuteDeals';
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
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [allEvents, setAllEvents] = useState<IEvent[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
    const [trendingEvents, setTrendingEvents] = useState<IEvent[]>([]);
    const [lastMinuteEvents, setLastMinuteEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        if (user) {
            Promise.all([fetchEvents(), fetchUserNotificationData()]);
        }
    }, [user]);

    const sortEventsByEndDate = (events: IEvent[]) => {
        return events.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    };

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const fetchedEvents = await getEvents();
            const sortedEvents = sortEventsByEndDate(fetchedEvents);
            setAllEvents(sortedEvents);
            setFilteredEvents(sortedEvents);
            
            // Filter trending events in Tel-Aviv
            const telAvivEvents = sortedEvents.filter(event => event.location.includes("Tel"));
            setTrendingEvents(telAvivEvents.slice(0, 5)); // Limit to 5 events for trending

            updateLastMinuteEvents(sortedEvents, 'All');
        } catch (error) {
            console.error('Error fetching events:', error);
            Alert.alert('Error', 'Failed to fetch events. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateLastMinuteEvents = (events: IEvent[], category: string) => {
        const now = new Date();
        const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
        const lastMinute = events.filter(event => {
            const endDate = new Date(event.endDate);
            return endDate > now && endDate <= fiveDaysLater && (category === 'All' || event.type === category);
        });
        setLastMinuteEvents(lastMinute);
    };

    const fetchUserNotificationData = async () => {
        try {
            const data = await getUserNotificationsRegistration(user?._id!);
            setNotifications(data);
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

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
        navigation.navigate('Event', { eventId: eventId });
    };

    const handleCategorySelect = useCallback((category: string) => {
        setSelectedCategory(category);
        if (category === 'All') {
            setFilteredEvents(allEvents);
        } else {
            const filtered = allEvents.filter(event => event.type === category);
            setFilteredEvents(filtered);
        }
        updateLastMinuteEvents(allEvents, category);
    }, [allEvents]);

    const categories = [
        { 
            title: 'All', 
            image: require('@/assets/images/concert.png'), 
            onPress: () => handleCategorySelect('All')
        },
        { 
            title: 'Sports', 
            image: require('@/assets/images/concert.png'), 
            onPress: () => handleCategorySelect('Sports')
        },
        { 
            title: 'Music', 
            image: require('@/assets/images/concert.png'), 
            onPress: () => handleCategorySelect('Music')
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchEvents} />
                }
            >
                <Text style={styles.title}>TicketMate</Text>
                <Text style={styles.greeting}>Hello, {user?.firstName}</Text>
                
                <CategoryTabs categories={categories} />
                
                <TrendingEventsCarousel events={trendingEvents} formatDate={formatDate} />
                
                <LastMinuteDeals 
                    events={lastMinuteEvents} 
                    onPressEvent={handleBuyTicket}
                    selectedCategory={selectedCategory}
                    formatDate={formatDate}
                />
                
                <View style={styles.eventListContainer}>
                <Text style={styles.subtitle}>
            All the shows
                </Text>
                    {filteredEvents.map(item => {
                        const isUserRegistered = notifications.some(
                            (notification) => notification.eventId === item._id
                        );
                        return (
                            <Card
                                key={item._id}
                                event={item}
                                isUserRegister={isUserRegistered}
                                onRegisterPress={() =>
                                    handleRegisterNotification(item._id, !isUserRegistered)
                                }
                                onBuyTicket={() => handleBuyTicket(item._id)}
                                showBuyButton={true}
                                showBellIcon={true}
                                formatDate={formatDate}
                            />
                        );
                    })}
                </View>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: 'black',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'rgb(155, 106, 173)',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        marginLeft: 20,
      },
    greeting: {
        fontSize: 18,
        color: 'white',
        marginBottom: 16,
        textAlign: 'center',
    },
    eventListContainer: {
        paddingHorizontal: 20,
    },
});

export default HomeScreen;