import { Route, Routes } from "react-router-dom";
import {
  Home,
  HomeProtected,
  Login,
  LoginAdmin,
  LoginProtected,
  SuperAdminPage,
  SuperAdminProtected,
} from "./pages";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <LoginProtected>
              <Login />
            </LoginProtected>
          }
        />
        <Route
          path="/home"
          element={
            <HomeProtected>
              <Home />
            </HomeProtected>
          }
        />
        <Route
          path="/super-admin"
          element={
            <SuperAdminProtected>
              <SuperAdminPage />
            </SuperAdminProtected>
          }
        />
        <Route path="/admin-login" element={<LoginAdmin />} />
        {/* <Route path="*" element={<Navigate to={token ? "/home" : "/"} />} /> */}
      </Routes>
    </div>
  );
};
