import { GlobalContext } from '@/App';
import axiosApiInstance from '@/axios';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

async function logout() {
  try {
    await axiosApiInstance.post('/auths/logout');
  } catch (e: unknown) {
    throw new Error(e);
  }
}

const useLogout = function () {
  const navigate = useNavigate();
  const { setUser } = useContext(GlobalContext);
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: () => {
      toast.success('User logout successfully');
      setUser(null);
      navigate('/auth/signin');
    },
  });
};

export { useLogout };
