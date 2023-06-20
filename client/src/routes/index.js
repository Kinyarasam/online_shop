import {
  createBrowserRouter,
} from "react-router-dom";
import DashBoard from '../views/DashBoard';
import auth from "./auth.routes";
import NotFound from '../views/NotFound';

const router = createBrowserRouter([
  ...auth,
  {
    path: '/dashboard',
    element: <DashBoard />,
    errorElement: <NotFound />
  }
]);

export default router;
