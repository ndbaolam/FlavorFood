import { createBrowserRouter, RouteObject } from 'react-router-dom';
import ErrorPage from '../error-page';
import SignIn from '../pages/Signin';
import SignUp from '../pages/Signup';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Meals from '../pages/Meals';
import BreakFast from '../pages/Meals/BreakFast';
import Vegetarian from '../pages/Meals/Vegetarian';
import Lunch from '../pages/Meals/Lunch';
import Drinks from '../pages/Meals/Drinks';
import Desserts from '../pages/Meals/Desserts';
import Tips from '../pages/Tips';
import RecipeDetail from '../pages/Meals/RecipeDetails';
import TipDetails from '../pages/Tips/TipDetails';
import Profile from '../pages/Profile';
import Favourite from '../pages/Favourite';
// Route definitions
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'sign-in',
        element: <SignIn />,
      },
      {
        path: 'sign-up',
        element: <SignUp />,
      },
      {
        path: 'dish',
        element: <Meals />,
        children: [
          {
            index: true,
            element: <Meals />,
          },
          {
            path: 'appetizer',
            element: <BreakFast />,
          },
          {
            path: 'main-course',
            element: <Vegetarian />,
          },
          {
            path: 'soup-hotpot',
            element: <Lunch />,
          },
          {
            path: 'drink',
            element: <Drinks />,
          },
          {
            path: 'dessert',
            element: <Desserts />,
          },
          // General routes for individual recipe details within each category
        ],
      },
      {
        path: 'dish/:slug.html',
        element: <RecipeDetail />,
      }, //tips/asdfasdf.html
      {
        path: 'tips',
        element: <Tips/>
      },
      {
        path: 'tips/:slug.html',
        element: <TipDetails/>
      },
      {
        path:'tips/:slug',
        element:<Tips />
      },
      {
        path:'profile',
        element:<Profile />
      },
      {
        path:'favourite',
        element:<Favourite />
      },
  
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
];

const AppRoutes = createBrowserRouter(routes);

export default AppRoutes;
