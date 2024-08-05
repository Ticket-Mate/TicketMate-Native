import { IEvent } from "@/types/event";
import apiClient from "./apiClient";
import { ITicket } from "@/types/ticket";

export const getTicketCountByEventId = async (
  userId: string,
  eventId: string
): Promise<number> => {
  try {
    const response = await apiClient.get<{ ticketCount: number }>(
      `/ticket/user/${userId}/event/${eventId}/ticketCount`
    );
    return response.data.ticketCount;
  } catch (error) {
    console.error("Error fetching ticket count by event ID:", error);
    throw error;
  }
};

export const getAvailableTicketsByEventId = async (
  eventId: string
): Promise<ITicket[]> => {
  try {
    const response = await apiClient.get<ITicket[]>(
      `/ticket/event/${eventId}/tickets`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets by event ID:", error);
    throw error;
  }
};

// Fetch tickets by user ID and event ID
export const getTicketsByUserAndEventId = async (
  userId: string,
  eventId: string
): Promise<ITicket[]> => {
  try {
    const response = await apiClient.get<ITicket[]>(
      `/ticket/user/${userId}/event/${eventId}/tickets`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets by user ID and event ID:", error);
    throw error;
  }
};

// Purchase tickets
export const purchaseTickets = async (
  userId: string,
  ticketIds: string[]
): Promise<ITicket[]> => {
  try {
    const response = await apiClient.post<ITicket[]>(`/ticket/purchase`, {
      userId,
      ticketIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    throw error;
  }
};

export const updateEventAvailableTickets = async (
  ticketId: string,
  price: string
): Promise<void> => {
  try {
    await apiClient.post(`ticket/updateEventAvailableTickets`, {
      ticketId,
      price,
    });
  } catch (error) {
    console.error("Error updating event available tickets:", error);
    throw error;
  }
};

export const removeEventAvailableTickets = async (
  ticketId: string
): Promise<void> => {
  try {
    await apiClient.post(`ticket/removeEventAvailableTickets`, { ticketId });
  } catch (error) {
    console.error("Error removing event available tickets:", error);
    throw error;
  }
};
