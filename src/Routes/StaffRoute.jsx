import { Navigate, useLocation } from "react-router";
import useRole from "../hooks/useRole";
import Loader from "../Components/Loader/Loader";


const StaffRoute = ({ children }) => {
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (role === "staff") {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default StaffRoute;
