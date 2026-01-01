// useSignUp.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { Error } from '@/types/errorType';
import AuthService from './auth.service';

function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: AuthService.resetPassowrd,
    onSuccess: (payload: any) => {
      toast.success(payload.message);
      navigate("/auth/signin");
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
}

export default useResetPassword;
