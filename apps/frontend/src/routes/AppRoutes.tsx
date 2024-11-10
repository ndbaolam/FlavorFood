import { createBrowserRouter, RouteObject } from "react-router-dom";
import ErrorPage from "../error-page";
import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import BreakFast from "../pages/Meals/BreakFast";
import Vegetarian from "../pages/Meals/Vegetarian";
import Meals from "../pages/Meals";
import Lunch from "../pages/Meals/Lunch";
import Drinks from "../pages/Meals/Drinks";
import Desserts from "../pages/Meals/Desserts";

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
  {
    path: "meals",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Meals />,
      },
      {
        path: "breakfast",
        element: <BreakFast />,
      },
      {
        path: "vegetarian",
        element: <Vegetarian />,
      },
   
      {
        path: "lunch",
        element: <Lunch/>,  
      },
      {
        path: "drinks",
        element: <Drinks />, 
      },
      {
        path: "dessert",
        element: <Desserts />, 
      },
    ],
  },
];

const AppRoutes = createBrowserRouter(routes);

export default AppRoutes;
