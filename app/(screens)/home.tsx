// screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, Alert, StyleSheet } from 'react-native';
import { HomePageStackParamList } from "@/components/navigation/HomePageNavigation";
import { ThemedView } from "@/components/ThemedView";
import useLogout from "@/hooks/useLogout";
import useUser from "@/hooks/useUser";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button, Text } from "react-native-paper";
import Card from '@/components/Card';
import { getEvents } from '../../api/event';
import { IEvent } from '@/types/event';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


type HomeScreenProps = {
  navigation: StackNavigationProp<HomePageStackParamList>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useUser();
  const { logoutUser } = useLogout({ navigation });
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to fetch events. Please try again.');
    }
  };
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      console.log('Retrieved user data from AsyncStorage:', userData); // Debugging log

      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  const handleBellPress = async (eventId: string) => {
    console.log('Bell pressed for event:', eventId);

    try {
      const userData = await getUserData();
      const accessToken = userData?.accessToken;
      console.log('Access token:', accessToken); // Debugging log

      if (!userData || !accessToken) {
        console.error('No user data or access token found');
        return;
      }
      const response = await axios.post(
        'http://localhost:3000/notifications/',
        { userId: userData._id, eventId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.status === 201) {
        console.log('Notification created successfully');
      } else { console.error('Failed to create notification'); }
    } catch (error) { console.error('Error creating notification:', error); }
  };

  const handleBuyTicket = (eventId: string) => {
    console.log('Buy ticket pressed for event:', eventId);
    // Implement navigation to ticket purchase screen or show purchase modal
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>TicketMate</Text>
      <Text>hello, {user?.firstName}</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card
            event={item}
            onBellPress={() => handleBellPress(item._id)}
            onBuyTicket={() => handleBuyTicket(item._id)}
          />
        )}
      />
      <Button onPress={logoutUser}>LogOut</Button>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'rgb(155, 106, 173)',
    textAlign: 'center'
  },
});

export default HomeScreen;