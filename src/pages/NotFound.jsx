import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <>
      <h1>404 - Not Found</h1>
      <p>Page not found</p>
      <Link to="/">Go back to home page</Link>
    </>
  );
}

export default NotFound;
