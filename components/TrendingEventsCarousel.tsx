import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { IEvent } from '@/types/event';

interface TrendingEventsCarouselProps {
  events: IEvent[];
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8;

const TrendingEventsCarousel: React.FC<TrendingEventsCarouselProps> = ({ events }) => {
  const renderItem = ({ item }: { item: IEvent }) => (
    <View style={styles.carouselItem}>
      <Image
        source={{ uri: item.images[0]?.url || '@/assets/images/concert.png' }}
        style={styles.image}
      />
      <Text style={styles.eventName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending Events in Tel-Aviv</Text>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
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
    width: ITEM_WIDTH,
    marginHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  eventName: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default TrendingEventsCarousel;