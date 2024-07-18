import { useState } from "react";
import { SignupData } from "@/types/auth";

const useSignUp = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  
  const createUser = async (formData: SignupData) => {
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if(!response.ok) {
        throw new Error('Failed to Sign-Up')
      }

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
