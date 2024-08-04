// ticket.tsx

import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import CheckBox from 'expo-checkbox';
import { Text } from "react-native-paper";
import { ITicket } from "../types/ticket";

interface TicketProps {
  ticket: ITicket;
  onSelect: (ticket: ITicket, selected: boolean) => void;
  selected: boolean;
}

const Ticket: FC<TicketProps> = ({ ticket, onSelect, selected }) => {
  return (
    <View style={styles.ticketContainer}>
      <View style={styles.ticketType}>
        <View style={styles.verticalTextContainer}>
          {'TICKET'.split('').map((char, index) => (
            <Text key={index} style={styles.ticketTypeText}>
              {char}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.ticketDetails}>
        <View style={styles.ticketSeat}>
          <Text style={styles.sectionRowText}>Seat</Text>
          <Text style={styles.infoText}>{ticket.position}</Text>
        </View>
          <View style={styles.separatorLine} />
        <View style={styles.ticketPrices}>
          <View style={styles.ticketSeat}>
            <Text style={styles.priceText}>Original Price</Text>
            <Text style={styles.infoText}>${ticket.originalPrice}</Text>
          </View>
          <View style={styles.ticketPrices}>
          <View style={styles.ticketSeat}>
            <Text style={styles.priceText}>Current Price</Text>
            <Text style={styles.infoText}>${ticket.resalePrice}</Text>
          </View>
          </View>
        </View>
        <View style={styles.separatorLine} />

        <CheckBox
          value={selected}
          onValueChange={(value: boolean) => onSelect(ticket, value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ticketContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    width: "100%",
    padding: 10,
  },
  ticketType: {
    backgroundColor: "#7c4dff",
    paddingHorizontal: 10,
  },
  verticalTextContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  ticketTypeText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },
  ticketDetails: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketSection: {
    alignItems: "center",
    paddingRight: 10,
  },
  sectionRowText: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 5,
  },
  infoText: {
    color: "#b4a7ff",
    fontSize: 18,
    fontWeight: "bold",
  },
  ticketPrices: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingLeft: 10,
  },
  ticketSeat: {
    alignItems: "center",
    paddingLeft: 10,
  },
  priceText: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 5,
  },
  separatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  separatorLine: {
    width: 69,
    borderWidth: 2,
    borderColor: 'rgba(246, 246, 246, 0.59)',
    borderStyle: 'dashed',
    transform: [{ rotate: '90deg' }],
  },
});

export default Ticket;
