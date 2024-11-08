import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IEvent, EventStatus } from "../types/event";
import { calculateTimer } from "../utils/timer";

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
  formatDate: (date: string) => string;
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
  formatDate,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>(calculateTimer(event.startDate));

  useEffect(() => {
    if (showCountdown) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimer(event.startDate));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showCountdown, event.startDate]);

  const isSoldOut = event.status === EventStatus.SOLD_OUT;
  const isOnSale = event.status === EventStatus.ON_SALE;
  const isAboutToStart = event.status === EventStatus.ABOUT_TO_START;
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // אם השעה היא 0 עד 11, זה בבוקר
    if (hours < 12) {
        return `${hours.toString()}:${minutes}`; // מציג את השעה כפי שהיא בבוקר
    } else {
        return `${hours}:${minutes}`; // מציג את השעה בפורמט 24 שעות אחר הצהריים
    }
};
  


  return (
    <View style={styles.card}>
      <Image
        source={{ uri: event.images[0]?.url || "../assets/images/concert.png" }}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{event.name}</Text>
          {showBellIcon && isSoldOut && (
            <TouchableOpacity onPress={onRegisterPress} style={styles.bellIcon}>
              <Icon
                name="bell"
                size={24}
                color={isUserRegister ? "#e358e8" : "#666"}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.description}>{event.type}</Text>
        <Text style={styles.description}>{event.location}</Text>
        <Text style={styles.date}>{formatDate(event.startDate)}</Text>
        <Text style={styles.time}>Start time :{formatTime(event.startDate)}</Text>  
        {(showCountdown || showTicketCount) && (
          <View style={styles.infoContainer}>
            {showCountdown && (
              <Text style={styles.countdownText}>{timeLeft}</Text>
            )}
            {showTicketCount && ticketCount !== undefined && (
              <Text style={styles.ticketCountText}>
                {`${ticketCount} ${ticketCount === 1 ? "ticket" : "tickets"}`}
              </Text>
            )}
          </View>
        )}
        {showBuyButton && !isSoldOut && !isAboutToStart && (
          <>
            {isOnSale && (
              <TouchableOpacity style={styles.buyButton} onPress={onBuyTicket}>
                <Text style={styles.buyButtonText}>Find ticket</Text>
              </TouchableOpacity>
            )}
            {isSoldOut && <Text style={styles.soldOutText}>Sold out</Text>}
          </>
        )}
        {isAboutToStart && (
          <Text style={styles.aboutToStartText}>Event is about to start!</Text>
        )}
        {isSoldOut && <Text style={styles.soldOutText}>Sold out</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "black",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  image: {
    width: 60,
    height: 90,
    marginRight: 12,
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "white",
  },
  description: {
    fontSize: 15,
    color: "#666",
  },
  date: {
    fontSize: 15,
    color: "#666",
  },
  infoContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  countdownText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
  },
  ticketCountText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 16,
  },
  bellIcon: {
    padding: 4,
  },
  buyButton: {
    backgroundColor: "#636366",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  soldOutText: {
    color: "#FF3B30",
    fontWeight: "bold",
    marginTop: 4,
  },
  aboutToStartText: {
    color: '#FF9500',
    fontWeight: 'bold',
    marginTop: 4,
  },
  time: {
    fontSize: 15,
    color: "#666",
  },

});

export default Card;
