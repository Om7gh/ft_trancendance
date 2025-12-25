import { RouterProvider } from 'react-router-dom';
import { routes } from '@routers';
import { useContext, useState, type JSX } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createContext } from 'react';

const queryClient = new QueryClient();

export interface User {
  avatar: string;
  bio: string;
  id: number;
  first_name: string;
  last_name: string;
  last_login: number;
  last_logout: number;
  username: string
}

interface GlobalContexyType {
  user: User | null;
  setUser: (user: User) => void;
}

export const GlobalContext = createContext<GlobalContexyType | null>(null);

const App = (): JSX.Element => {
  const [user, setUser] = useState<User | null>();
  console.log(user);


  return (
    <div className="App">
      <GlobalContext.Provider value={{ user, setUser }}>
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
