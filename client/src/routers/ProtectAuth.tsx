import { GlobalContext } from '@/App';
import axiosApiInstance from '@/axiosApiInstance';
import { useContext, useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectAuth = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { setUser } = useContext(GlobalContext);

  useEffect(() => {
    const verify = async () => {
      try {
        await axiosApiInstance.get('/api/auth/userinfo');
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
