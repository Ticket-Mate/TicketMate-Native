import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { IconButton } from "react-native-paper";
import ProfileScreen from "@/app/(screens)/profile";
import HomePageNavigation from "./HomePageNavigation";
import TicketManagementNavigation from "./TicketManagmentNavigation";
import SearchNavigation from "./SearchNavigation";

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
        name="HomePage"
        component={HomePageNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <IconButton icon="home" size={24} iconColor={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchPage"
        component={SearchNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <IconButton icon="magnify" size={24} iconColor={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TicketManagementPage"
        component={TicketManagementNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <IconButton icon="ticket" size={24} iconColor={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
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
