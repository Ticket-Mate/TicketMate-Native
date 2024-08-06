import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { IEvent } from '@/types/event';

interface LastMinuteDealsProps {
  events: IEvent[];
  onPressEvent: (eventId: string) => void;
}

const LastMinuteDeals: React.FC<LastMinuteDealsProps> = ({ events, onPressEvent }) => {
  const renderItem = ({ item }: { item: IEvent }) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => onPressEvent(item._id)}>
      <Image source={{ uri: item.images[0]?.url || '@/assets/images/concert.png' }} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
        <Text style={styles.eventDate}>{new Date(item.endDate).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Minute Deals</Text>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginLeft: 20,
  },
  eventItem: {
    width: 150,
    marginRight: 15,
  },
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginLeft:16
  },
  eventDetails: {
    marginTop: 5,
    marginLeft:16,
  },
  eventName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventLocation: {
    color: '#888',
    fontSize: 12,
  },
  eventDate: {
    color: '#888',
    fontSize: 12,
  },
});

export default LastMinuteDeals;