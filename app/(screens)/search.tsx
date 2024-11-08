import React, { useCallback, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, View } from "react-native";
import { Chip, Searchbar } from 'react-native-paper';
import { IEvent } from "@/types/event";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { getEvents, searchEvents } from "@/api/event";
import { getUserNotificationsRegistration, registerUserForEventNotification, unregisterUserFromEventNotification } from "@/api/notification";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/Card";
import { StackNavigationProp } from "@react-navigation/stack";
import { SearchNavigationStackParamList } from "@/components/navigation/SearchNavigation";
import { INotification } from "@/types/notification";
import { useFocusEffect } from "expo-router";
import Loader from "@/components/Loader";

type SearchScreenProps = {
  navigation: StackNavigationProp<SearchNavigationStackParamList>;
};

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [allEvents, setAllEvents] = useState<IEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<{ [key: string]: boolean }>({
    Music: false,
    Sports: false,
    Art: false,
    Theater: false,
    Comedy: false,
    Festivals: false,
    Conferences: false,
    Workshops: false,
    Exhibitions: false,
    Networking: false,
  });

  useFocusEffect(
    useCallback(() => {
      fetchAllEvents();
      fetchUserNotificationData();
    }, [])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const filterPastEvents = (events: IEvent[]): IEvent[] => {
    const now = new Date();
    return events.filter(event => new Date(event.endDate) > now);
  };

  const fetchAllEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await getEvents();
      const activeEvents = filterPastEvents(fetchedEvents);
      setAllEvents(activeEvents);
      setFilteredEvents(activeEvents);
    } catch (error) {
      console.error('Error fetching all events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchEvents = async (filters:{ [key: string]: boolean }) => {
    try {
      setIsLoading(true);
      const activeFilters = Object.keys(filters).filter(key => filters[key]).join(',');

      if (searchQuery || activeFilters.length) {
        const fetchedEvents = await searchEvents(searchQuery, activeFilters);
        const activeEvents = filterPastEvents(fetchedEvents);
        setFilteredEvents(activeEvents);
      } else {
        setFilteredEvents(allEvents);
      }
    } catch (error) {
      console.error('Error searching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    const filters = {...searchFilter, [filter]: !searchFilter[filter]}
    setSearchFilter(filters);
    handleSearchEvents(filters);
  };

  const fetchUserNotificationData = async () => {
    try {
      const data = await getUserNotificationsRegistration(user?._id!);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
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

  const handleEventPress = (eventId: string) => {
    navigation.navigate("Event", { eventId: eventId });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={{ top: 80, width: '90%' }}>
        <Searchbar
          placeholder="Search"
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearchEvents(searchFilter);
          }}
          value={searchQuery}
        />
        <View style={styles.chipContainer}>
          {Object.keys(searchFilter).map(filter => (
            <Chip
              key={filter}
              selected={searchFilter[filter]}
              onPress={() => handleFilterChange(filter)}
              style={styles.chip}
            >
              {filter}
            </Chip>
          ))}
        </View>
      </View>
      <View style={{ top: 100, width: '90%' }}>
        {!isLoading ? (<FlatList
          data={filteredEvents}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchAllEvents} />
          }
          getItemLayout={(data, index) => ({
            length: 20,
            offset: 20 * index,
            index,
          })}
          renderItem={({ item }) => {
            const isUserRegistered = notifications.some(
              (notification) => notification.eventId === item._id
            );
            return (
              <Card
                key={item._id}
                event={item}
                isUserRegister={isUserRegistered}
                onRegisterPress={() => handleRegisterNotification(item._id, !isUserRegistered)}
                onBuyTicket={() => handleEventPress(item._id)}
                formatDate={formatDate}
              />
            );
          }}
        />) : <View style={{ paddingTop: 200 }}><Loader /></View>}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    margin: 4,
  },
});

export default SearchScreen;