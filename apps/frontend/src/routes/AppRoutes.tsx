import { createBrowserRouter, RouteObject } from 'react-router-dom';
import ErrorPage from '../error-page';
import SignIn from '../pages/Signin';
import SignUp from '../pages/Signup';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Meals from '../pages/Meals';
import Tips from '../pages/Tips';
import RecipeDetail, { clientLoader as recipeLoader } from '../pages/Meals/RecipeDetails';
import TipDetails, { clientLoader as tipLoader } from '../pages/Tips/TipDetails';
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
      },
      {
        path: 'dish/:slug.html',
        element: <RecipeDetail />,
        loader: recipeLoader,
      }, //tips/asdfasdf.html
      {
        path: 'tips',
        element: <Tips/>
      },
      {
        path: 'tips/:slug.html',
        element: <TipDetails/>,
        loader: tipLoader,
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
