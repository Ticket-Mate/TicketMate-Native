import { getAuthToken } from "@/utils/auth";
import apiClient from "./apiClient";
import { ITicket } from "@/types/ticket";

export const getTicketCountByEventId = async (
  userId: string,
  eventId: string
): Promise<number> => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get<{ ticketCount: number }>(
      `/ticket/user/${userId}/event/${eventId}/ticketCount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
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
    const token = await getAuthToken();
    const response = await apiClient.get<ITicket[]>(
      `/ticket/event/${eventId}/tickets`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets by event ID:", error);
    throw error;
  }
};

export const getTicketsByUserAndEventId = async (
  userId: string,
  eventId: string
): Promise<ITicket[]> => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get<ITicket[]>(
      `/ticket/user/${userId}/event/${eventId}/tickets`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets by user ID and event ID:", error);
    throw error;
  }
};

export const purchaseTickets = async (
  userId: string,
  ticketIds: string[]
): Promise<ITicket[]> => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.post<ITicket[]>(`/ticket/purchase`, {
      userId,
      ticketIds,
    },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    throw error;
  }
};

export const emailTicketReceipt = async (userId: string, paymentIntentId: string): Promise<void> => {
  try {
    await apiClient.post(`/api/payments/handle-successful-payment`, { userId, paymentIntentId });
  } catch (error) {
    console.error("Error emailing ticket receipt:", error);
    throw error;
  }
}

export const emailToSeller = async (selectedTickets: ITicket[]): Promise<void> => {
  try {
    const sellerData: { [key: string]: { tickets: ITicket[], totalResalePrice: number } } = {};

    selectedTickets.forEach(ticket => {
      const { ownerId, resalePrice } = ticket;
      if (!resalePrice) return;

      if (!sellerData[ownerId]) {
        sellerData[ownerId] = { tickets: [], totalResalePrice: 0 };
      }

      sellerData[ownerId].tickets.push(ticket);
      sellerData[ownerId].totalResalePrice += resalePrice;
    });

    const commissionRate = 0.05;

    const token = await getAuthToken()

    for (const ownerId in sellerData) {
      if (Object.prototype.hasOwnProperty.call(sellerData, ownerId)) {
        const { tickets, totalResalePrice } = sellerData[ownerId];
        const commissionAmount = totalResalePrice * commissionRate;
        const totalTransferred = totalResalePrice - commissionAmount;

        await apiClient.post(`/api/payments/send-seller-email`, {
          userId: ownerId,
          amountSold: totalResalePrice,
          commissionAmount,
          totalTransferred,
          tickets: tickets.map(ticket => ({
            ticketId: ticket._id,
            resalePrice: ticket.resalePrice,
          })),
        },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
      }
    }
  } catch (error) {
    console.error("Error sending seller emails:", error);
    throw error;
  }
};

export const removeEventAvailableTickets = async (
  ticketId: string
): Promise<void> => {
  try {
    const token = await getAuthToken()
    await apiClient.post(`/ticket/removeEventAvailableTickets`, { ticketId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  } catch (error) {
    console.error("Error removing event available tickets:", error);
    throw error;
  }
};

export const updateTicketPrice = async (ticketId: string, resalePrice: string): Promise<ITicket> => {
  try {
    const token = await getAuthToken()
    const response = await apiClient.put<ITicket>(`/ticket/updateTicketPrice/${ticketId}`, { resalePrice, onSale: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error("Error updating ticket price:", error);
    throw error;
  }
};

export const removeTicketFromSale = async (ticketId: string): Promise<void> => {
  try {
    const token = await getAuthToken()
    await apiClient.put(`/ticket/removeTicketFromSale/${ticketId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  } catch (error) {
    console.error("Error removing ticket from sale:", error);
    throw error;
  }
};
