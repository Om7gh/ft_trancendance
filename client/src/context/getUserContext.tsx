import type { signUpData } from '@/types/userType';
import { createContext, useState, type ReactNode } from 'react';

interface User extends signUpData {
  avatar: string;
  bio: string;
  id: number;
}

const Context = createContext<User | null>(null);

const UserContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  return (
    <Context.Provider value={user, setUser }>{children}</Context.Provider>
  );
};

export { UserContext };