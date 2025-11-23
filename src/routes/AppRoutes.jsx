import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ManagerDashboard from '../pages/Dashboard/ManagerDashboard';
import ProductsList from '../pages/Products/ProductsList';
import ProductDetail from '../pages/Products/ProductDetail';
import SalesProductDetail from '../pages/Products/SalesProductDetail';
import SupervisorsList from '../pages/Supervisors/SupervisorsList';
import StoresList from '../pages/Stores/StoresList';
import SalesList from '../pages/Sales/SalesList';
import CustomersList from '../pages/Customers/CustomersList';
import Login from '../pages/Login';
import UpdatePassword from '../pages/UpdatePassword';
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
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR', 'SALES']}>
            <ProductsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR']}>
            <ProductDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/sales/:code"
        element={
          <ProtectedRoute allowedRoles={['SALES']}>
            <SalesProductDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stores"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <StoresList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisors"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR']}>
            <SupervisorsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR']}>
            <SalesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <CustomersList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-password"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR', 'SALES']}>
            <UpdatePassword />
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
