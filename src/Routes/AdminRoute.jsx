import { Navigate, useLocation } from "react-router";
import useRole from "../hooks/useRole";
import Loader from "../Components/Loader/Loader";


const AdminRoute = ({ children }) => {
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (role === "admin") {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;
