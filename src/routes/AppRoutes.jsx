import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ManagerDashboard from '../pages/Dashboard/ManagerDashboard';
import ProductsList from '../pages/Products/ProductsList';
import SupervisorsList from '../pages/Supervisors/SupervisorsList';

export default function AppRoutes() {
  return (
    <Routes>
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
    </Routes>
  );
}
