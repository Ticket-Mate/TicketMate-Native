import React, { useCallback, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, View } from "react-native";
import { Chip, Searchbar } from 'react-native-paper';
import { IEvent } from "@/types/event";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { searchEvents } from "@/api/event";
import { getUserNotificationsRegistration, registerUserForEventNotification, unregisterUserFromEventNotification } from "@/api/notification";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/Card";
import { StackNavigationProp } from "@react-navigation/stack";
import { SearchNavigationStackParamList } from "@/components/navigation/SearchNavigation";
import { INotification } from "@/types/notification";
import { useFocusEffect } from "expo-router";

type SearchScreenProps = {
  navigation: StackNavigationProp<SearchNavigationStackParamList>;
};

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
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
      const activeFilters = Object.keys(searchFilter).filter(key => searchFilter[key]);
      console.log('Active filters:', activeFilters);
      if (searchQuery || activeFilters.length) {
        handleSearchEvents();
        fetchUserNotificationData();
      } else {
        setEvents([])
      }
    }, [searchQuery, searchFilter]))


  const handleSearchEvents = async () => {
    try {
      setIsLoading(true);
      const activeFilters = Object.keys(searchFilter).filter(key => searchFilter[key]).join(',');


      const fetchedEvents = await searchEvents(searchQuery, activeFilters);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setSearchFilter(prevState => ({
      ...prevState,
      [filter]: !prevState[filter],
    }));
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
    navigation.navigate("userTicketsDetails", { eventId });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={{ top: 80, width: '90%' }}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
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
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleSearchEvents} />
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
                event={item}
                isUserRegister={isUserRegistered}
                onRegisterPress={() =>
                  handleRegisterNotification(item._id, !isUserRegistered)
                }
                onBuyTicket={() => handleEventPress(item._id)}
              />
            );
          }}
        />
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