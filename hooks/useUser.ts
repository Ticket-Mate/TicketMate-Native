import { useState } from 'react';
import Cookies from 'js-cookie';
import { IUser } from '@/types/auth';


const useUser = () => {
    const storedUser = Cookies.get('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const [user, setUser] = useState<IUser | null>(parsedUser);

    const logoutUser = () => {
        setUser(null);
        Cookies.remove('user');
    };

    return { user, logoutUser };
};

export default useUser;
