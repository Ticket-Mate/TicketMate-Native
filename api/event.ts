import apiClient from "./apiClient";
import { IEvent } from "../types/event";
import { getAuthToken } from "@/utils/auth";

export const getEvents = async (): Promise<IEvent[]> => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get<IEvent[]>("/Event", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const searchEvents = async (q: string, filter: string): Promise<IEvent[]> => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get<IEvent[]>(`/Event?q=${q}&type=${filter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (id: string): Promise<IEvent> => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get<IEvent>(`/Event/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
};

export const getEventsByUserId = async (userId: string): Promise<IEvent[]> => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get<IEvent[]>(`/ticket/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events by user ID:", error);
    throw error;
  }
};

export const getPassedEventsByUserId = async (userId: string): Promise<IEvent[]> => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get<IEvent[]>(`/ticket/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const filtered = response.data.filter(event => new Date(event.endDate) < new Date());
    return filtered;
  } catch (error) {
    console.error("Error fetching passed events by user ID:", error);
    throw error;
  }
};

