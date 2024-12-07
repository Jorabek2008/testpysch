import React, { ReactNode, useMemo } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ROLE } from "../mock";

interface Proto {
  children: ReactNode;
}

export const HomeProtected: React.FC<Proto> = ({ children }) => {
  const user = localStorage.getItem("token");
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  if (!isAuthenticated) {
    toast.error("Sizda bu sahifaga kirish huquqi yo'q!");
    return <Navigate to="/" />;
  }

  if (ROLE === "USER" || ROLE !== "ADMIN") {
    return children;
  }

  if (ROLE === "ADMIN") {
    return <Navigate to={"/super-admin"} />;
  }
};
