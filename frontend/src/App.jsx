import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const { isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
}
