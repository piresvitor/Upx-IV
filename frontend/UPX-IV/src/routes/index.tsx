import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layouts/navbar";
import Home from "@/pages/home";
import Map from "@/pages/map";
import MapDetails from "@/pages/mapDetails";
import RegisterAccount from "@/pages/createUser";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Stats from "@/pages/stats";
import PrivateRoute from "./privateRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      // ✅ Rotas protegidas
      {
        element: <PrivateRoute />,
        children: [
          { path: "map", element: <Map /> },
          { path: "details/:placeId", element: <MapDetails /> },
          { path: "profile", element: <Profile /> },
          { path: "stats", element: <Stats /> },
        ],
      },
    ],
  },

  { path: "/account/register", element: <RegisterAccount /> },
  { path: "/login", element: <Login /> },
]);

export default router;
