import axiosApiInstance from '@/axios';
import { useMutation } from '@tanstack/react-query';
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
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: () => {
      toast.success('User logout successfully');
      navigate('/auth/signin');
    },
  });
};

export { useLogout };
