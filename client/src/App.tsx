import { Route, Routes } from "react-router-dom";
import { Home, HomeProtectedAuth, Login, LoginProtectedAuth } from "./pages";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <LoginProtectedAuth>
              <Login />
            </LoginProtectedAuth>
          }
        />
        <Route
          path="/home"
          element={
            <HomeProtectedAuth>
              <Home />
            </HomeProtectedAuth>
          }
        />
        {/* <Route path="*" element={<Navigate to={token ? "/home" : "/"} />} /> */}
      </Routes>
    </div>
  );
};
