import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OrganizerRoute = ({ children }) => {
  const { userInfo } = useAuth();
  let location = useLocation();

  if (userInfo && userInfo.role === "organizer") {
    return children;
  }

  return <Navigate to="/apply-organizer" state={{ from: location }} replace />;
};

export default OrganizerRoute;
