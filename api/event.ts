import apiClient from './apiClient';
import { IEvent } from '../types/event';

export const getEvents = async (): Promise<IEvent[]> => {
  try {
    const response = await apiClient.get<IEvent[]>('/Event');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};


export const getEvent = async (eventId: string): Promise<IEvent> => {
  try {
    const response = await apiClient.get<IEvent>(`/Event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
}