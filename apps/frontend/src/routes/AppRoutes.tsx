import { createBrowserRouter, RouteObject } from 'react-router-dom';
import ErrorPage from '../error-page';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/Admin/AdminLayout';
import Home from '../pages/Home';
import Meals from '../pages/Meals';
import Tips from '../pages/Tips';
import RecipeDetail, { clientLoader as recipeLoader } from '../pages/Meals/RecipeDetails';
import TipDetails, { clientLoader as tipLoader } from '../pages/Tips/TipDetails';
import Profile from '../pages/Profile';
import Favourite from '../pages/Favourite';
import Market from '../pages/Market';
import StoreRegistration from '../pages/Market/StoreRegistration';
import SignIn from '../pages/Signin';
import SignUp from '../pages/Signup';
import LogIn from '../components/Admin/LogIn';
import Accounts from '../pages/Admin/Account';
import Posts from '../pages/Admin/Post';
import Tip from '../pages/Admin/Tip';
import AdminStore from '../pages/Admin/Store';
import SellerHome from '../pages/Seller/Home';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dish', element: <Meals /> },
      { path: 'dish/:slug.html', element: <RecipeDetail />, loader: recipeLoader },
      { path: 'tips', element: <Tips /> },
      { path: 'tips/:slug.html', element: <TipDetails />, loader: tipLoader },
      { path: 'profile', element: <Profile /> },
      { path: 'favorite', element: <Favourite /> },
      { path: 'market', element: <Market /> },
      { path: 'store-registration', element: <StoreRegistration /> },
      { path: 'my-store', element: <SellerHome /> },  
      { path: '*', element: <ErrorPage /> },
    ],
  },
  { path: '/sign-in', element: <SignIn />, errorElement: <ErrorPage /> },
  { path: '/sign-up', element: <SignUp />, errorElement: <ErrorPage /> },
  { path: '/admin/login', element: <LogIn />, errorElement: <ErrorPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'accounts', element: <Accounts /> },
      { path: 'posts', element: <Posts /> },
      { path: 'tips', element: <Tip /> },
      { path: 'stores', element: <AdminStore /> },
    ],
  },
];

const AppRoutes = createBrowserRouter(routes);
export default AppRoutes;
