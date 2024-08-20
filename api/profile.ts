import { getAuthToken } from '@/utils/auth';
import apiClient from './apiClient';

export type UpdateUser = {
    email: string,
    firstName: string,
    lastName: string,
}

export const updateUser = async (userId: string, data: UpdateUser) => {
    try {
        const token = await getAuthToken();
        const response = await apiClient.put(`/user/${userId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};


