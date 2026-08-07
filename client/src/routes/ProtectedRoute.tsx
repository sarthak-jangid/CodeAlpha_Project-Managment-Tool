import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300" role="status" aria-live="polite">
        <Loader label="Checking your session..." />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
