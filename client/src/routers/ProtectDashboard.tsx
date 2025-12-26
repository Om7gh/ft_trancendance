import { GlobalContext } from '@/App';
import api from '@/services/clientHttpService';
import { useContext, useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectDashboard = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { setUser } = useContext(GlobalContext);

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await api.get('/api/auth/userinfo');
        setAuthenticated(true);
        setUser(data.data);
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
  return authenticated ? children : <Navigate to="/auth/signin" replace />;
};

export default ProtectDashboard;
