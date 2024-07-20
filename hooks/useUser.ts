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

    return { user };
};

export default useUser;
