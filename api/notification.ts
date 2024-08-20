import { INotification } from "@/types/notification";
import apiClient from "./apiClient";
import { IEvent } from "@/types/event";
import { getAuthToken } from "@/utils/auth";

export const registerUserForEventNotification = async (userId: string, eventId: string) => {
    try {
        const token = await getAuthToken();
        const response = await apiClient.post<INotification>('/notifications', {
            userId, eventId
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user for event notification:', error);
        throw new Error('Failed to register user for event notification');
    }
};

export const unregisterUserFromEventNotification = async (userId: string, eventId: string) => {
    try {
        const token = await getAuthToken();
        const response = await apiClient.delete(`/notifications/${userId}/${eventId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error unregistering user from event notification:', error);
        throw new Error('Failed to unregister user from event notification');
    }
};

export const getUserNotificationsRegistration = async (userId: string) => {
    try {
        const token = await getAuthToken();
        const response = await apiClient.get<INotification[]>(`/notifications/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log('User notifications registration:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting user notifications registration:', error);
        throw new Error('Failed to get user notifications registration');
    }
};

export const getInterestsEventsByUser = async (userId: string) => {
    try {
        const token = await getAuthToken();
        const response = await apiClient.get<IEvent[]>(`/notifications/interests/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting interests events by user:', error);
        throw new Error('Failed to get interests events by user');
    }
}