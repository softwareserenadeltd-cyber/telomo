import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const captchaPassed = localStorage.getItem('captchaPassed') === 'true';
  return captchaPassed ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
