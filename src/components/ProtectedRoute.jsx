import React from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuth, authedUser, loader, setLoader } = useAuth();
  const location = useLocation();

  // if loader is on dont return any elements
  if (loader) return null;

  // if there is no AuthedUser take the user to login page
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // in case server passed a strange role
  if (allowedRoles && !allowedRoles.includes(authedUser?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
