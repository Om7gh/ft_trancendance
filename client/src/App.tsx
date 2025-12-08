import { RouterProvider } from 'react-router-dom';
import { routes } from '@routers';
import { useEffect, useState, type JSX } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createContext } from 'react';
import type { signUpData } from './types/userType';

const queryClient = new QueryClient();

interface User extends signUpData {
  avatar: string;
  bio: string;
  id: number;
}

interface GlobalContexyType {
  user: User | null | undefined;
  setUser: (user: User) => void;
}
export const GlobalContext = createContext<GlobalContexyType | null>(null);

const App = (): JSX.Element => {
  useEffect(() => {
    console.log(document.cookie.split(';'));
  }, []);
  const [user, setUser] = useState<User | null>();

  return (
    <div className="App">
      <GlobalContext.Provider value={{ user: user, setUser: setUser }}>
        <div className="Child bg-midnight/80 ">
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
            <RouterProvider router={routes} />
          </QueryClientProvider>
        </div>
      </GlobalContext.Provider>
    </div>
  );
};

export default App;
