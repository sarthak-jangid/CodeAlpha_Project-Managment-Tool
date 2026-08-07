import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <Card className="max-w-xl p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-100">Page not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          The route you are looking for does not exist. Use the dashboard link to continue.
        </p>
        <div className="mt-8 flex justify-center">
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
