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
import AdminLayout from '../layouts/Admin/AdminLayout';
import Market from '../pages/Market';
import Accounts from '../pages/Admin/Account';
import Posts from '../pages/Admin/Post';
import Tip from '../pages/Admin/Tip';
import LogIn from '../components/Admin/LogIn';
import SellerLayout from '../layouts/Seller/SellerLayout';
import SellerHome from '../pages/Seller/Home';
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
      }, 
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
        path:'favorite',
        element:<Favourite />
      },
  
      {
        path: '*',
        element: <ErrorPage />,
      },
      {
        path:'market',
        element:<Market />
      },
    ],
  },
  {
  path:"admin/login", 
  element:<LogIn />,
   errorElement: <ErrorPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "accounts", element: <Accounts /> },
      { path: "posts", element: <Posts /> },
      { path: "tips", element: <Tip /> },
     
    ],
  },
  {
  path :'/seller',
  element:<SellerLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      element: <SellerHome />,
      index: true,
    },
  ]
  }

];

const AppRoutes = createBrowserRouter(routes);

export default AppRoutes;