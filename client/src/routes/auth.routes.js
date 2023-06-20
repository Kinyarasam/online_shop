import App from "../App";
import NotFound from '../views/NotFound';

const auth = [
  {
    path: '/auth',
    element: <App />,
    errorElement: <NotFound />
  }
];

export default auth;
