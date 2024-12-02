import { Home, Login } from "../pages";
import { ROUTES_NAME } from "./routesEnum";

export const ROUTES_LINK = [
  {
    path: ROUTES_NAME.HOME,
    element: <Home />,
  },
  {
    path: ROUTES_NAME.LOGIN,
    element: <Login />,
  },
];
