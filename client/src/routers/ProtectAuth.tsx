import { GlobalContext } from '@/App';
import AuthService from '@/services/auth/auth.service';
// import AuthService from '@/services/auth/auth.service';
import { useContext, useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectAuth = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { setUser } = useContext(GlobalContext);

  useEffect(() => {
    const verify = async () => {
      try {
        await AuthService.userInfo()
        setAuthenticated(true);
      } catch (err) {
          setAuthenticated(false);
          setUser(null);
      }
      setLoading(false);
    };

    verify();
  }, []);

  if (loading)
    return (
      <div className="h-screen grid place-items-center text-violet-500">
        Loading...
      </div>
    );
  return !authenticated ? children : <Navigate to="/dashboard" replace />;
};

export default ProtectAuth;
