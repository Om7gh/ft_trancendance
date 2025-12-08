import useAuthenticated from '@/services/auth/useAuthenticated';
import { useTransStore } from '@/store/useTransStore';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

function AuthProtection({ children }: { children: ReactNode }) {
  const isAuth = useAuthenticated();
  const setUser = useTransStore((state) => state.setUser);

  if (isAuth.error) <Navigate to="/auth" />;
  setUser(isAuth.data?.user);
  return children;
}

export default AuthProtection;
