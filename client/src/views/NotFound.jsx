import { useRouteError } from "react-router-dom";

const NotFound = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <div id='error-page'>
      <h1>{error.status} { error.statusText }</h1>
      SomeError Happened. Try again!!!
    </div>
  )
};

export default NotFound;