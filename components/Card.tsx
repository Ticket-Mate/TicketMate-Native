import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IEvent, EventStatus } from "../types/event";

interface CardProps {
  event: IEvent;
  isUserRegister: boolean;
  onRegisterPress?: () => void;
  onBuyTicket?: () => void;
  showBuyButton?: boolean;
  showBellIcon?: boolean;
  formatDate: (date: string) => string;
}

const Card: React.FC<CardProps> = ({
  event,
  isUserRegister,
  onRegisterPress,
  onBuyTicket,
  showBuyButton = true,
  showBellIcon = true,
  formatDate,
}) => {
  const isSoldOut = event.status === EventStatus.SOLD_OUT;
  const isOnSale = event.status === EventStatus.ON_SALE;

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
        <Text style={styles.date}>{formatDate(event.endDate)}</Text>
        {showBuyButton && (
          <>
            {isOnSale && (
              <TouchableOpacity style={styles.buyButton} onPress={onBuyTicket}>
                <Text style={styles.buyButtonText}>Find ticket</Text>
              </TouchableOpacity>
            )}
            {isSoldOut && <Text style={styles.soldOutText}>Sold out</Text>}
          </>
        )}
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
});

export default Card;