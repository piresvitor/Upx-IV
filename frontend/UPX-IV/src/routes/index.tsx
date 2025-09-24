import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/layouts/layout";
import Map from "@/pages/map";
import LandingPage from "@/pages/ladingPage";
import MapDetails from "@/pages/mapDetails";

export const isAuthenticated = false;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "map", element: <Map /> },
      {
        path: "details",
        element: isAuthenticated ? <MapDetails /> : <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
