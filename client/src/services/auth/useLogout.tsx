import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from './auth.service';


const useLogout = function () {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: AuthService.logout,
    onSuccess: () => {
      toast.success('User logout successfully');
      navigate('/auth/signin');
    },
  });
};

export { useLogout };
