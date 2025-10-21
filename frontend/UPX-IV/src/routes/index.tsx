import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layouts/navbar";
import Map from "@/pages/map";
import Home from "@/pages/home";
import MapDetails from "@/pages/mapDetails";
import RegisterAccount from "@/pages/createUser";
import Login from "@/pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "map", element: <Map /> },
      { path: "details/:placeId", element: <MapDetails /> },
    ],
  },
  { path: "/account/register", element: <RegisterAccount /> },
  { path: "/login", element: <Login /> },
]);

export default router;
