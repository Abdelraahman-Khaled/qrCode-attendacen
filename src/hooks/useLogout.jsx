import { useAuthContext } from "./useAuthContext";

const useLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = () => {
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        workoutsDispatch({ type: "SET_WORKOUTS", payload: null });
    };

    return { logout };
};

export default useLogout;
