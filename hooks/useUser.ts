import { useEffect, useState } from 'react';
import { IUser } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const useUser = () => {
    const [user, setUser] = useState<IUser | null>();

    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        const storedUser = await AsyncStorage.getItem('user')
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUser(parsedUser)
    }

    const logoutUser = () => {
        setUser(null);
        AsyncStorage.removeItem('user');
    };

    return { user, logoutUser };
};

export default useUser;
