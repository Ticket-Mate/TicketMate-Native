import React, { useState, useCallback } from "react";
import { Avatar, Text, Button, TextInput } from "react-native-paper";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, View, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { IEvent } from "@/types/event";
import { launchImageLibrary } from 'react-native-image-picker';
import { getInterestsEventsByUser } from "@/api/notification";
import { getPassedEventsByUserId } from "@/api/event";
import { useFocusEffect } from "@react-navigation/native";
import IntrestEventCarousel from "@/components/IntrestEventCarousel";

const isPastDate = (date: string) => {
  return new Date(date) < new Date();
};

const ProfileScreen: React.FC = () => {
  const { user, handleUpdateUser, handleLogout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newFirstName, setNewFirstName] = useState(user?.firstName || '');
  const [newLastName, setNewLastName] = useState(user?.lastName || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPhoto, setNewPhoto] = useState(user?.pictureUrl || '');
  const [interests, setInterests] = useState<IEvent[]>([]);
  const [ownedEvents, setOwnedEvents] = useState<IEvent[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUserNotificationData();
        fetchOwnedEvents();
      }
    }, [user])
  );

  const fetchUserNotificationData = async () => {
    try {
      const data = await getInterestsEventsByUser(user?._id!);
      // Filter out past events
      const currentAndFutureEvents = data.filter(event => !isPastDate(event.endDate));
      setInterests(currentAndFutureEvents);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchOwnedEvents = async () => {
    try {
      const data = await getPassedEventsByUserId(user?._id!);
      setOwnedEvents(data);
    } catch (error) {
      console.error("Error fetching owned events:", error);
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets[0])
        setNewPhoto(response.assets[0].uri || '');
    });
  };

  const handleSave = async () => {
    try {
      await handleUpdateUser(user?._id!, {
        email: newEmail,
        firstName: newFirstName,
        lastName: newLastName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user info:', error);
      Alert.alert('Error', 'Failed to update user information.');
    }
  };

  const handleCancel = () => {
    setNewFirstName(user?.firstName || '');
    setNewLastName(user?.lastName || '');
    setNewEmail(user?.email || '');
    setNewPhoto(user?.pictureUrl || '');
    setIsEditing(false);
  };

  const renderAvatar = () => {
    if (isEditing) {
      return (
        <TouchableOpacity onPress={handleImagePick}>
          {newPhoto ? <Avatar.Image size={100} source={{ uri: newPhoto }} /> : <Avatar.Text size={100} label={newFirstName.charAt(0)} />}
        </TouchableOpacity>
      );
    } else if (user?.pictureUrl) {
      return <Avatar.Image size={100} source={{ uri: user.pictureUrl }} />;
    } else {
      const initials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;
      return <Avatar.Text size={100} label={initials} />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          {renderAvatar()}
          {isEditing ? (
            <>
              <TextInput
                label="First Name"
                value={newFirstName}
                onChangeText={setNewFirstName}
                style={styles.input}
              />
              <TextInput
                label="Last Name"
                value={newLastName}
                onChangeText={setNewLastName}
                style={styles.input}
              />
              <TextInput
                label="Email"
                value={newEmail}
                onChangeText={setNewEmail}
                style={styles.input}
              />
              <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handleSave} style={styles.button}>Done</Button>
                <Button mode="outlined" onPress={handleCancel} style={styles.button}>Cancel</Button>
              </View>
            </>
          ) : (
            <>
              <Text variant="headlineSmall">{user?.firstName} {user?.lastName}</Text>
              <Text>{user?.email}</Text>
              <Button mode="contained" onPress={() => setIsEditing(true)} style={styles.editbtn}>Edit Profile</Button>
            </>
          )}
        </View>

        {!isEditing && (
          <>
            <View style={styles.carouselSection}>
              <Text style={styles.title}>Events you have been:</Text>
              {ownedEvents.length > 0 ? (
                <IntrestEventCarousel events={ownedEvents} />
              ) : (
                <Text style={styles.noEventsMessage}>You haven't been in any event.</Text>
              )}
            </View>

            <View style={styles.carouselSection}>
              <Text style={styles.title}>Events you have interest in:</Text>
              {interests.length > 0 ? (
                <IntrestEventCarousel events={interests} />
              ) : (
                <Text style={styles.noEventsMessage}>You haven't shown interest in any event.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {!isEditing && (
        <View style={styles.logoutButtonContainer}>
          <Button mode="outlined" onPress={handleLogout}>Logout</Button>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileSection: {
    paddingTop: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  editbtn: {
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  button: {
    width: '45%',
  },
  carouselSection: {
    marginBottom: 20,
  },
  noEventsMessage: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'gray',
    marginVertical: 10,
  },
  logoutButtonContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    marginBottom: 10,
  },
});

export default ProfileScreen;

  // const formatDate = (isoDate: string) => {
  //   const date = new Date(isoDate);
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = date.getFullYear();
  //   const hours = String(date.getHours()).padStart(2, '0');
  //   const minutes = String(date.getMinutes()).padStart(2, '0');

  //   return `${day}/${month}/${year}, ${hours}:${minutes}`;
  // };
  // const renderEventItem = ({ item }: { item: IEvent }) => (
  //   <View style={{ marginRight: 70 }}>
  //     <Card
  //       event={item}
  //       isUserRegister={false}
  //       onRegisterPress={() => { }}
  //       ticketCount={0}
  //       showCountdown={true}
  //       showTicketCount={true}
  //       showBuyButton={false}
  //       showBellIcon={false}
  //     />
  //   </View>
  // );

  // const handleNext = () => {
  //   const nextIndex = (currentIndex + 1) % interests.length;
  //   setCurrentIndex(nextIndex);
  //   flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  // };

  // const handlePrev = () => {
  //   const prevIndex = (currentIndex - 1 + interests.length) % interests.length;
  //   setCurrentIndex(prevIndex);
  //   flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  // };

      // {/* Owned Events Carousel */}
      // {/* <Text variant="headlineSmall" style={styles.interest}>My Past Events</Text>
      // <View >
      //   {ownedEvents.length > 0 ? (
      //     <View style={styles.carouselContainer}>
      //       <FlatList
      //         data={ownedEvents}
      //         renderItem={renderEventItem}
      //         keyExtractor={item => item._id}
      //         horizontal
      //         showsHorizontalScrollIndicator={false}
      //         pagingEnabled
      //       />
      //     </View>
      //   ) : (
      //     <Text style={styles.noInterestsMessage}>No past events found.</Text>
      //   )}
      // </View> */}
      // <View>
      //   {isLoading ? (
      //     <ActivityIndicator size="large" />
      //   ) : interests.length > 0 ? (
      //     <View style={styles.carouselContainer}>
      //       <IconButton
      //         icon="chevron-left"
      //         size={30}
      //         onPress={handlePrev}
      //         style={styles.arrowButton}
      //       />
      //       <FlatList
      //         ref={flatListRef}
      //         data={interests}
      //         renderItem={renderEventItem}
      //         keyExtractor={item => item._id}
      //         horizontal
      //         showsHorizontalScrollIndicator={false}
      //         onScrollToIndexFailed={(info) => {
      //           const wait = new Promise(resolve => setTimeout(resolve, 500));
      //           wait.then(() => {
      //             flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
      //           });
      //         }}
      //         onViewableItemsChanged={({ viewableItems }) => {
      //           if (viewableItems.length > 0) {
      //             setCurrentIndex(viewableItems[0].index ?? 0);
      //           }
      //         }}
      //         getItemLayout={(data, index) => (
      //           { length: 300, offset: 300 * index, index }
      //         )}
      //         pagingEnabled
      //       />
      //       <IconButton
      //         icon="chevron-right"
      //         size={30}
      //         onPress={handleNext}
      //         style={styles.arrowButton}
      //       />
      //     </View>
      //   ) : (
      //     <Text style={styles.noInterestsMessage}>
      //       You have not shown intrest in any event.
      //     </Text>
      //   )}
      // // </View> */