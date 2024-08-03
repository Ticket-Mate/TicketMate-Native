import apiClient from './apiClient';

export const updateUser = async (userId: string, data: any) => {
    try {
        const response = await apiClient.put(`/user/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
