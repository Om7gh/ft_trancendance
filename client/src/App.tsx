import { RouterProvider } from "react-router-dom";
import { routes } from "@routers";
import { useEffect, type JSX } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

const App = (): JSX.Element => {
  useEffect(() => {
    console.log(document.cookie.split(";"));
  }, []);
  return (
    <div className="App">
      <div className="Child bg-midnight">
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ToastContainer />
          <RouterProvider router={routes} />
        </QueryClientProvider>
      </div>
    </div>
  );
};

export default App;
