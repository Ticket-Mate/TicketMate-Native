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
    console.log(response.data.ticketCount);
    return response.data.ticketCount;
  } catch (error) {
    console.error("Error fetching ticket count by event ID:", error);
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
