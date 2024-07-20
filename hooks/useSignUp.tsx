import { useState } from "react";
import { SignupData } from "@/types/auth";
import { register } from "@/api/auth";

const useSignUp = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  
  const createUser = async (formData: SignupData) => {
    try {
      await register(formData)
      setIsSuccess(true)
      setIsError(false)
    }
    catch(e) {
      console.log(`Failed to creating user ${e}`)
      setIsError(true)
    }finally{
      setIsLoading(false)
    }
  };
  return { createUser, isSuccess, isLoading, isError };
};

export default useSignUp;
