import Cookies from 'js-cookie';
import { LoginForm } from "@/app/(screens)/login";
import { useState } from "react";
import { IUser } from '@/types/auth';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>()

  const handleLogin = async (formData: LoginForm) => {
    try {
      const response = await fetch('https://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if(!response.ok) {
        throw new Error('Failed to Login')
      }

      const data = await response.json()
      setIsError(false)
    }
    catch(e) {
      console.log(`Failed to login ${e}`)
      setIsError(true)
    }finally{
      setIsLoading(false)
    }
  }

  const updateUser = (newUserData: IUser) => {
    setUser(newUserData);
    Cookies.set('user', JSON.stringify(newUserData), { expires: 7 });
};

  return { handleLogin, user, isLoading, isError };
};

export default useLogin;
