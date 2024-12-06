import React, { ReactNode, useMemo } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Proto {
  children: ReactNode;
}

export const LoginProtectedAuth: React.FC<Proto> = ({ children }) => {
  const user = localStorage.getItem("token");

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  if (!isAuthenticated) {
    return children;
  }
  const navigate = () => {
    toast.success("Siz login qilgansiz");
    return <Navigate to="/home" />;
  };
  return navigate();
};
