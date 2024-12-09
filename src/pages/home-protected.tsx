import React, { ReactNode, useMemo } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Proto {
  children: ReactNode;
}

export const HomeProtected: React.FC<Proto> = ({ children }) => {
  const user = localStorage.getItem("token");
  const role = localStorage.getItem("isAdmin");
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  if (!isAuthenticated) {
    toast.error("Sizda bu sahifaga kirish huquqi yo'q!");
    return <Navigate to="/" />;
  }

  if (role === "USER") {
    return children;
  }

  if (role === "ADMIN") {
    return <Navigate to={"/super-admin"} />;
  }
};
