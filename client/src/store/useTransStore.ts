import type { signUpData } from '@/types/userType';
import { create } from 'zustand';

interface User extends signUpData {
  avatar?: string;
  bio: string;
  id: number;
}

type Store = {
  registerSuccess: boolean;
  setRegisterSuccess: () => void;
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
};

const useTransStore = create<Store>()((set) => ({
  // variables
  registerSuccess: false,
  user: null,

  // function handlers
  setRegisterSuccess: () =>
    set((state) => ({
      registerSuccess: state.registerSuccess === true ? false : true,
    })),
  setUser: (userData: User) =>
    set(() => ({
      user: userData,
    })),
  clearUser: () =>
    set(() => ({
      user: null,
      registerSuccess: false,
    })),
}));

export { useTransStore };
