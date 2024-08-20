import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser, LoginData, SignupData } from '@/types/auth';
import { login, register } from '@/api/auth';
import { UpdateUser, updateUser } from '@/api/profile';

export interface AuthContextType {
  user: IUser | null;
  handleLogin: (formData: LoginData) => Promise<void>;
  handleSignup: (formData: SignupData) => Promise<void>;
  handleUpdateUser: (userId: string, updatedData: UpdateUser) => Promise<void>;
  handleLogout: () => void;
  loginStatus: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
  };
  signupStatus: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
  };
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const [loginStatus, setLoginStatus] = useState({
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const [signupStatus, setSignupStatus] = useState({
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  useEffect(() => {
    const getUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(parsedUser);
    };
    getUserData();
  }, []);

  const handleLogin = async (formData: LoginData) => {
    setLoginStatus({ isLoading: true, isError: false, isSuccess: false });
    try {
      const { data: user } = await login(formData);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setLoginStatus({ isLoading: false, isError: false, isSuccess: true });
    } catch (e) {
      console.log(`Failed to login ${e}`);
      setLoginStatus({ isLoading: false, isError: true, isSuccess: false });
    }
  };

  const handleSignup = async (formData: SignupData) => {
    setSignupStatus({ isLoading: true, isError: false, isSuccess: false });
    try {
      await register(formData);
      setSignupStatus({ isLoading: false, isError: false, isSuccess: true });
    } catch (e) {
      console.log(`Failed to create user ${e}`);
      setSignupStatus({ isLoading: false, isError: true, isSuccess: false });
    }
  };

  const handleUpdateUser = async (userId: string, updatedData: UpdateUser) => {
    const data = await updateUser(userId, updatedData);
    await AsyncStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleSignup, handleLogout, loginStatus, handleUpdateUser, signupStatus }}>
      {children}
    </AuthContext.Provider>
  );
};