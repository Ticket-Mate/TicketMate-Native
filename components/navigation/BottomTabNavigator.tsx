// components/navigation/MainTabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { IconButton } from "react-native-paper";
import HomeScreen from "@/app/(screens)/home";
import SearchScreen from "@/app/(screens)/SearchScreen";
import TicketManagerScreen from "@/app/(screens)/TicketManagementScreen";
import UserScreen from "@/app/(screens)/UserScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#1C1C1E" },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <IconButton icon="microphone" size={24} iconColor={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <IconButton icon="magnify" size={24} iconColor={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketManagerScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <IconButton icon="ticket" size={24} iconColor={color} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <IconButton icon="account" size={24} iconColor={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
