import {
  createBrowserRouter,
} from "react-router-dom";
import DashBoard from '../views/DashBoard';
import auth from "./auth.routes";
import NotFound from '../views/NotFound';
import nav from "./nav.routes";

const router = createBrowserRouter([
  ...auth,
  ...nav,
  {
    path: '/dashboard',
    element: <DashBoard />,
    errorElement: <NotFound />
  }
]);

export default router;
