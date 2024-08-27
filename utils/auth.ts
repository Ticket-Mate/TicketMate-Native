
import dayjs from 'dayjs';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from '@/api/auth';



export const getAuthToken = async (): Promise<string | undefined>  => {
    const storedUser = await AsyncStorage.getItem('user');
    
    if (storedUser) {
        try {
            const { accessToken, lastRefreshTime, refreshToken:token, refreshTokenInterval } = JSON.parse(storedUser);

            if (!accessToken) {
                throw Error("Authorization token is missing");
            }

            const currentTime = dayjs();
            const elapsedTime = currentTime.diff(lastRefreshTime);

            if (elapsedTime >= refreshTokenInterval) {
                const { data: user } = await refreshToken(token);
                await AsyncStorage.setItem('user', JSON.stringify(user));
                return user.accessToken
            }

            return accessToken;
        } catch (error) {
            throw Error(`Error parsing user AsyncStorage:${error}`);
        }
    }
    return undefined;
};