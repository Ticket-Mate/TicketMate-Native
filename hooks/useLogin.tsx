import { useState } from "react";
import { IUser, LoginData } from '@/types/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomePageStackParamList } from '@/components/navigation/HomePageNavigation';
import { login } from '@/api/auth';

const useLogin = ({navigation}: { navigation: StackNavigationProp<HomePageStackParamList>}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>()

  const handleLogin = async (formData: LoginData) => {
    try {
      
      const { data: user, status } = await login(formData)
      
      // TODO: save in the storage modify updateUser

      navigation.navigate("Home" as any)
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
    // Cookies.set('user', JSON.stringify(newUserData), { expires: 7 });
};

  return { handleLogin, user, isLoading, isError };
};

export default useLogin;
