import React, { ReactNode, useMemo } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
interface Proto {
  children: ReactNode;
}

export const SuperAdminProtected: React.FC<Proto> = ({ children }) => {
  const user = localStorage.getItem("token");
  const role = localStorage.getItem("isAdmin");
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  if (!isAuthenticated || role !== "ADMIN") {
    toast.success("Siz admin emassiz!");
    return <Navigate to="/home" />;
  }

  return children;
};
