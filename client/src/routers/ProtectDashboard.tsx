import axios from 'axios';
import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectDashboard = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get('/auths/userinfo', { withCredentials: true });
        setAuthenticated(true);
      } catch (err) {
        console.log(err);
        if (err.response?.status === 401) {
          try {
            await axios.post('/auths/refresh', {}, { withCredentials: true });
            // retry
            await axios.get('/auths/userinfo', { withCredentials: true });
            setAuthenticated(true);
          } catch (refreshErr) {
            setAuthenticated(false);
          }
        } else {
          setAuthenticated(false);
        }
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
