import type { Error } from '@/types/errorType';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from './auth.service';

function useTwoFactorAuth() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: AuthService.verifyLogin,
    onSuccess: () => {
      toast.success(`Welcome Back!`);
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Code is not correct Please try again.');
    },
  });
}

export { useTwoFactorAuth };
