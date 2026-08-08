import { Navigate, Route, Routes } from 'react-router-dom';
import { Card } from './components/common/Card';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectsPage from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

const SettingsPage = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-100">Settings</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Workspace preferences and account controls will appear here as your experience evolves.
        </p>
      </Card>
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
