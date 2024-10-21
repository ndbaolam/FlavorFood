import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App";
import ErrorPage from "../error-page";
import Signin from "../pages/Signin";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "sign-in",
    element: <Signin/>,
    errorElement: <ErrorPage />,
  }
]);

export default AppRoutes;