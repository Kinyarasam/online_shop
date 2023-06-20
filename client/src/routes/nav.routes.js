import DashBoard from "../views/DashBoard";
import NotFound from "../views/NotFound";
import UserProfile from '../views/UserProfile';
import Logout from '../views/Logout';

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
  }
];

export default nav;