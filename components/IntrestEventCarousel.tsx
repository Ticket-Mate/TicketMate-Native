import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { IEvent } from '@/types/event';
import Card from './Card';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

interface IntrestEventCarouselProps {
    events: IEvent[];
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8;

const IntrestEventCarousel: React.FC<IntrestEventCarouselProps> = ({ events }) => {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            console.log('IntrestEventCarousel focused');
        }, [events])
    );

    const handleBuyTicket = (eventId: string) => {
        // Navigate to the event screen with the event ID
        navigation.navigate('Event', { eventId });
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };
    const renderItem = ({ item }: { item: IEvent }) => (
        <View style={styles.carouselItem}>
            <Card
                key={item._id}
                event={item}
                isUserRegister={true}
                onRegisterPress={() => { }}
                onBuyTicket={() => handleBuyTicket(item._id)}
                showBuyButton={true}
                showCountdown={false}
                showTicketCount={false}
                showBellIcon={false}
                formatDate={formatDate} />
        </View>
    );

    return (
        <View style={styles.container}>
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
    carouselContent: {
        paddingHorizontal: 10,
    },
    carouselItem: {
        width: ITEM_WIDTH,
        marginHorizontal: 10,
    },
});

export default IntrestEventCarousel;
