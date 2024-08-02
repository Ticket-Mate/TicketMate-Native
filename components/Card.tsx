import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IEvent, EventStatus } from '../types/event';
import { calculateTimer } from '../utils/timer';

interface CardProps {
  event: IEvent;
  isUserRegister: boolean;
  onRegisterPress?: () => void;
  onBuyTicket?: () => void;
  ticketCount?: number;
  showCountdown?: boolean;
  showTicketCount?: boolean;
  showBuyButton?: boolean;
  showBellIcon?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  event, 
  isUserRegister, 
  onRegisterPress, 
  onBuyTicket, 
  ticketCount, 
  showCountdown = false, 
  showTicketCount = false,
  showBuyButton = true,
  showBellIcon = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (showCountdown) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimer(event.startDate));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showCountdown, event.startDate]);

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: event.images[0]?.url || '../assets/images/concert.png' }}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{event.name}</Text>
          {showBellIcon && event.status === EventStatus.SOLD_OUT && (
            <TouchableOpacity onPress={onRegisterPress} style={styles.bellIcon}>
              <Icon name="bell" size={24} color={isUserRegister ? '#e358e8' : '#666'} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.description}>{event.description || 'Description not specified'}</Text>
        <Text style={styles.date}>{new Date(event.startDate).toLocaleDateString()}</Text>
        {(showCountdown || showTicketCount) && (
          <View style={styles.buttonContainer}>
            {showCountdown && (
              <TouchableOpacity style={styles.timeButton}>
                <Text style={styles.timeButtonText}>{timeLeft}</Text>
              </TouchableOpacity>
            )}
            {showTicketCount && ticketCount !== undefined && (
              <TouchableOpacity style={styles.ticketButton}>
                <Text style={styles.ticketButtonText}>{`${ticketCount} tickets`}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {showBuyButton && event.status === EventStatus.ON_SALE && (
          <TouchableOpacity style={styles.buyButton} onPress={onBuyTicket}>
            <Text style={styles.buyButtonText}>Buy ticket</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  image: {
    width: 60,
    height: 90,
    marginRight: 12,
    marginTop: 8
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: 'white'
  },
  description: {
    fontSize: 15,
    color: '#666',
  },
  date: {
    fontSize: 15,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  timeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  timeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ticketButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  ticketButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bellIcon: {
    padding: 4,
  },
  buyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Card;
