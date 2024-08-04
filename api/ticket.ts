import { IEvent } from "@/types/event";
import apiClient from "./apiClient";

export const getEventsByUserId = async (userId: string): Promise<IEvent[]> => {
  try {
    const response = await apiClient.get<IEvent[]>(`/ticket/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events by user ID:", error);
    throw error;
  }
};

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
