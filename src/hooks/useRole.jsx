import { useAuth } from "../Context/AuthContext";

/**
 * Custom hook to get user role
 * Returns role from AuthContext (already merged with user object)
 *
 * @returns {Object} { role: string, roleLoading: boolean }
 */
const useRole = () => {
  const { user, loading } = useAuth();

  return {
    role: user?.role || "citizen",
    roleLoading: loading,
  };
};

export default useRole;
