import { GlobalContext } from '@/App';
import useAuthenticated from '@/services/auth/useAuthenticated';
import { useCallback, useContext, useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

function AuthProtection({ children }: { children: ReactNode }) {
  const ctx = useContext(GlobalContext);
  const isAuth = useAuthenticated();

  if (isAuth.error) <Navigate to="/auth" />;
  useEffect(() => {
    ctx?.setUser(isAuth.data?.user);
  }, [isAuth.data?.user]);
  return children;
}

export default AuthProtection;
