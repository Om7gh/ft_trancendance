import { RouterProvider } from 'react-router-dom';
import { routes } from '@routers';
import { useState, type JSX, type Dispatch, type SetStateAction} from 'react';
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
  username: string;
}

interface GlobalContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => {},
});

const App = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);

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
