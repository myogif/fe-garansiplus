import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ManagerDashboard from '../pages/Dashboard/ManagerDashboard';
import ProductsList from '../pages/Products/ProductsList';
import SupervisorsList from '../pages/Supervisors/SupervisorsList';
import Login from '../pages/Login';
import { useAuth } from '../context/AuthContext';

export default function AppRoutes() {
  const { isAuthed, role } = useAuth();

  const getRedirectPath = () => {
    if (!isAuthed) {
      return '/login';
    }
    return role === 'MANAGER' ? '/dashboard' : '/products';
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthed ? <Navigate to={getRedirectPath()} replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={['MANAGER','SUPERVISOR','SALES']}>
            <ProductsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisors"
        element={
          <ProtectedRoute allowedRoles={['MANAGER','SUPERVISOR']}>
            <SupervisorsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to={getRedirectPath()} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
