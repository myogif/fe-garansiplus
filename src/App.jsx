import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Toast from './components/Toast';

const AppRoutes = () => {
  const { isAuthed, role } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthed ? <Navigate to={role === 'MANAGER' ? '/dashboard' : '/products'} replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'SUPERVISOR']}>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to={isAuthed ? (role === 'MANAGER' ? '/dashboard' : '/products') : '/login'} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toast />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
