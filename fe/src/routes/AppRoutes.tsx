import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App";
import ErrorPage from "../error-page";

import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "sign-in",
    element: <SignIn/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "sign-up",
    element:<SignUp/>,
    errorElement:< ErrorPage/>,
  }
]);

export default AppRoutes;