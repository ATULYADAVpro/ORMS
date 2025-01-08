import { useQuery } from "@tanstack/react-query";

// Custom hook to fetch auth data
const useAuth = () => {
    return useQuery({
        queryKey: ['auth'],  // Correct query key format
        queryFn: () => {
            // Fetch from localStorage or use initial values
            const authData = JSON.parse(localStorage.getItem('auth')) || { isAuthenticated: false, user: null };
            return authData;
        },
    });
};

export default useAuth;