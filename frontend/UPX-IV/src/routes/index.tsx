import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/layouts/navbar";
import Map from "@/pages/map";
import Home from "@/pages/home";
import MapDetails from "@/pages/mapDetails";

export const isAuthenticated = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "map", element: <Map /> },
      {
        path: "details",
        element: isAuthenticated ? <MapDetails /> : <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
