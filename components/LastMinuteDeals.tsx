import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { IEvent } from '@/types/event';
import Card from './Card';

interface LastMinuteDealsProps {
  events: IEvent[];
  onPressEvent: (eventId: string) => void;
  selectedCategory: string;
  formatDate: (date: string) => string;
}

const LastMinuteDeals: React.FC<LastMinuteDealsProps> = ({ events, onPressEvent, selectedCategory, formatDate }) => {
  const renderItem = ({ item }: { item: IEvent }) => (
    <Card
      event={item}
      isUserRegister={false}
      onBuyTicket={() => onPressEvent(item._id)}
      showBuyButton={true}
      showBellIcon={false}
      formatDate={formatDate}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedCategory === 'All' ? 'Last Minute Deals' : `Last Minute ${selectedCategory} Deals`}
      </Text>
      {events.length > 0 ? (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noEventsText}>There are no last minute deals currently</Text>
      )}
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
  noEventsText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 20,
    fontStyle: 'italic',
  },
});

export default LastMinuteDeals;