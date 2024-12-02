import { Routes } from "react-router-dom";
import { AppRouter, ROUTES_LINK } from "./routes";

export const App = () => {
  return (
    <Routes>
      {AppRouter(ROUTES_LINK.map((route) => ({ ...route, children: [] })))}
    </Routes>
  );
};
