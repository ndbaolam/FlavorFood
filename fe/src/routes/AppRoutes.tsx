import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App";
import ErrorPage from "../error-page";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
]);

export default AppRoutes;