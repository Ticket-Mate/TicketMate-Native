import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { IEvent } from '@/types/event';

interface TrendingEventsCarouselProps {
  events: IEvent[];
  formatDate: (date: string) => string;
}

const TrendingEventsCarousel: React.FC<TrendingEventsCarouselProps> = ({ events, formatDate }) => {
  // Sort events by end date (closest first)
  const sortedEvents = [...events].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  const renderItem = ({ item }: { item: IEvent }) => (
    <View style={styles.carouselItem}>
      <Image
        source={{ uri: item.images[0]?.url || "@/assets/images/concert.png" }}
        style={styles.eventImage}
      />
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDate}>{formatDate(item.endDate)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending Events in Tel-Aviv</Text>
      <FlatList
        data={sortedEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={100}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
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
  carouselContent: {
    paddingHorizontal: 10,
  },
  carouselItem: {
    width: 480,
    marginHorizontal: 10,
  },
  eventImage: {
    width: 300,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default TrendingEventsCarousel;