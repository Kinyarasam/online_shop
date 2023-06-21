import DashBoard from "../views/DashBoard";
import NotFound from "../views/NotFound";
import UserProfile from '../views/UserProfile';
import Logout from '../views/Logout';
import UsersViews from "../views/users";

// const token = localStorage.getItem(token);

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
    element: <>Products Info</>,
    errorElement: < NotFound />
  },
  {
    path: '/orders',
    element: <>Orders Info</>,
    errorElement: < NotFound />
  }
];

export default nav;