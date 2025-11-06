import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthed, role } = useAuth();

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'MANAGER') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default ProtectedRoute;
