import apiClient from "./apiClient";
import { IEvent } from "../types/event";

export const getEvents = async (): Promise<IEvent[]> => {
  try {
    const response = await apiClient.get<IEvent[]>("/Event");
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const searchEvents = async (q:string, filter: string): Promise<IEvent[]> => {
  try {
    const response = await apiClient.get<IEvent[]>(`/Event?q=${q}&type=${filter}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (id: string): Promise<IEvent> => {
  try {
    const response = await apiClient.get<IEvent>(`/Event/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
};

export const getEventsByUserId = async (userId: string): Promise<IEvent[]> => {
  try {
    const response = await apiClient.get<IEvent[]>(`/ticket/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events by user ID:", error);
    throw error;
  }
};
