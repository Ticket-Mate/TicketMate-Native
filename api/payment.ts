import { getAuthToken } from "@/utils/auth";
import apiClient from "./apiClient";
import { Alert } from "react-native";

export const fetchPaymentSheetParams = async (amount: number, email: string): Promise<{ clientSecret: string; paymentIntentId: string } | null> => {
    try {
        const token = await getAuthToken()
        const response = await apiClient.post<{ clientSecret: string; paymentIntentId: string }>('/api/payments/create-payment-intent', {
            amount,
            email,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const { clientSecret, paymentIntentId } = response.data;
        return { clientSecret, paymentIntentId };
    } catch (error) {
        console.error("Error fetching payment sheet parameters:", error);
        Alert.alert("Error", "Unable to fetch payment sheet parameters.");
        return null;
    }
  };