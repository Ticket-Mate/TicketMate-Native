
import { IEvent } from '@/types/event';
import apiClient from "./apiClient"

export const getEventsByUserId = async (userId: string): Promise<IEvent[]> => {
    try {
      const response = await apiClient.get<IEvent[]>(`/ticket/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events by user ID:', error);
      throw error;
    }
  }
