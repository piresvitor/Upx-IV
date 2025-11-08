import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/layouts/navbar";
import PrivateRoute from "./privateRoutes";

// Lazy loading das páginas para code splitting
const Home = lazy(() => import("@/pages/home"));
const Map = lazy(() => import("@/pages/map"));
const MapDetails = lazy(() => import("@/pages/mapDetails"));
const RegisterAccount = lazy(() => import("@/pages/createUser"));
const Login = lazy(() => import("@/pages/login"));
const Profile = lazy(() => import("@/pages/profile"));
const Stats = lazy(() => import("@/pages/stats"));

// Componente de loading para Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
      },

      // ✅ Rotas protegidas
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "map",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Map />
              </Suspense>
            ),
          },
          {
            path: "details/:placeId",
            element: (
              <Suspense fallback={<PageLoader />}>
                <MapDetails />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "stats",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Stats />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  {
    path: "/account/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterAccount />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
]);

export default router;
