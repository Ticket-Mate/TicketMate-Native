import { useState } from "react";
import { IUser, LoginData } from '@/types/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomePageStackParamList } from '@/components/navigation/HomePageNavigation';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from '@/api/auth';

const useLogin = ({navigation}: { navigation: StackNavigationProp<HomePageStackParamList>}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>()

  const handleLogin = async (formData: LoginData) => {
    try {
      
      const { data: user, status } = await login(formData)
      await updateUser(user)
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

  const updateUser = async (newUserData: IUser) => {
    setUser(newUserData);
    await AsyncStorage.setItem('user', JSON.stringify(newUserData));
};

  return { handleLogin, user, isLoading, isError };
};

export default useLogin;
