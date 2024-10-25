// AppRoutes.tsx
import { createBrowserRouter, RouteObject } from "react-router-dom";
import ErrorPage from "../error-page";
import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "sign-in",
    element: <SignIn />,
    errorElement: <ErrorPage />,
  },
  {
    path: "sign-up",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
];

const AppRoutes = createBrowserRouter(routes);

export default AppRoutes;
