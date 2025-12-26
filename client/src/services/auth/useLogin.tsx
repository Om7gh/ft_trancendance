// useSignUp.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { Error } from '@/types/errorType';
import AuthService from './auth.service';

function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (payload) => {
      toast.success(payload.message);
      navigate(payload.next);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please try again.');
      if (error.statusCode === 401) navigate('/auth/activation');
      if (error.statusCode === 404) navigate('/auth/signUp');
    },
  });
}

export default useLogin;
