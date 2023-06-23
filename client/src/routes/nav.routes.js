import DashBoard from "../views/DashBoard";
import NotFound from "../views/NotFound";
import UserProfile from '../views/UserProfile';
import Logout from '../views/Logout';
import UsersViews from "../views/users";
import ProductsViews from '../views/productViews';
import OrdersView from '../views/ordersViews.jsx';

const nav = [
  {
    path: '/',
    element: < DashBoard />,
    errorElement: < NotFound />
  },
  {
    path: '/profile',
    element: < UserProfile />,
    errorElement: < NotFound />
  },
  {
    path: '/logout',
    element: < Logout />,
    errorElement: < NotFound />
  },
  {
    path: '/users',
    element: < UsersViews />,
    errorElement: < NotFound />
  },
  {
    path: '/products',
    element: < ProductsViews />,
    errorElement: < NotFound />
  },
  {
    path: '/orders',
    element: < OrdersView />,
    errorElement: < NotFound />
  }
];

export default nav;