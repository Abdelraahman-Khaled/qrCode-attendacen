import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const signup = async (name, email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await axios.post("https://qr-code-generator-backend-nodejs-production.up.railway.app/api/instructors/register", {
                name,
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
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    return { signup, isLoading, error };
};

export default useSignup;
