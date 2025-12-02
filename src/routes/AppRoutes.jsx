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
import ForgotPassword from '../pages/ForgotPassword';
import UpdatePassword from '../pages/UpdatePassword';
import { useAuth } from '../context/AuthContext';

export default function AppRoutes() {
  const { isAuthed, role, loading } = useAuth();

  // FIX: Prevent routing logic from running until auth is restored
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const getRedirectPath = () => {
    if (!isAuthed) {
      return '/login';
    }
    return (role === 'MANAGER' || role === 'SERVICE_CENTER') ? '/dashboard' : '/products';
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthed ? <Navigate to={getRedirectPath()} replace /> : <Login />}
      />
      <Route
        path="/forgot-password"
        element={isAuthed ? <Navigate to={getRedirectPath()} replace /> : <ForgotPassword />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SERVICE_CENTER']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR', 'SALES', 'SERVICE_CENTER']}>
            <ProductsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR', 'SERVICE_CENTER']}>
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
          <ProtectedRoute allowedRoles={['MANAGER', 'SERVICE_CENTER']}>
            <StoresList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisors"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR', 'SERVICE_CENTER']}>
            <SupervisorsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR', 'SERVICE_CENTER']}>
            <SalesList />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/customers"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SERVICE_CENTER']}>
            <CustomersList />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/update-password"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR', 'SALES', 'SERVICE_CENTER']}>
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