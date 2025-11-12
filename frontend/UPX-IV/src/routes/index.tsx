import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/layouts/navbar";
import PrivateRoute from "./privateRoutes";
import MapDetails from "@/pages/mapDetails";
import { Button } from "@/components/ui/button";

// Lazy loading das páginas para code splitting
const Home = lazy(() => import("@/pages/home"));
const Map = lazy(() => import("@/pages/map"));
// MapDetails removido do lazy loading temporariamente para resolver erro de contexto
// const MapDetails = lazy(() => import("@/pages/mapDetails"));
const RegisterAccount = lazy(() => import("@/pages/createUser"));
const Login = lazy(() => import("@/pages/login"));
const Profile = lazy(() => import("@/pages/profile"));
const Stats = lazy(() => import("@/pages/stats"));
const Places = lazy(() => import("@/pages/places"));

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
            element: <MapDetails />,
            errorElement: (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  Erro ao carregar página
                </h2>
                <p className="text-gray-600 mb-4">
                  Não foi possível carregar os detalhes do local.
                </p>
                <Button onClick={() => window.location.href = "/map"}>
                  Voltar ao mapa
                </Button>
              </div>
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
          {
            path: "places",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Places />
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
