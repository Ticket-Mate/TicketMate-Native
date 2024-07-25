import { INotification } from "@/types/notification";
import apiClient from "./apiClient";

export const registerUserForEventNotification = async (userId: string, eventId: string) => {
    try {
        const response = await apiClient.post<INotification>('/notifications', {
            userId, eventId
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user for event notification:', error);
        throw new Error('Failed to register user for event notification');
    }
};

export const unregisterUserFromEventNotification = async (userId: string, eventId: string) => {
    try {
        const response = await apiClient.delete(`/notifications/${userId}/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Error unregistering user from event notification:', error);
        throw new Error('Failed to unregister user from event notification');
    }
};

export const getUserNotificationsRegistration = async (userId: string) => {
    try {
        const response = await apiClient.get<INotification[]>(`/notifications/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting user notifications registration:', error);
        throw new Error('Failed to get user notifications registration');
    }
};