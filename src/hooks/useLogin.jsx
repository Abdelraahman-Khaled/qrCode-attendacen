import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:5000/api/instructors/login", {
        email,
        password,
      });

      // Save user to local storage
      localStorage.setItem("user", JSON.stringify(data));

      // Update auth context
      dispatch({ type: "LOGIN", payload: data });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return { login, isLoading, error };
};

export default useLogin;
