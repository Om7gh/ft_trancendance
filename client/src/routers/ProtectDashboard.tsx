import useAuthenticated from '@/services/auth/useAuthenticated';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectDashboard({ children }: { children: ReactNode }) {
  const isAuth = useAuthenticated();
  console.log(isAuth);
  if (isAuth.isSuccess) return <Navigate to="/dashboard" />;

  return children;
}

export default ProtectDashboard;
