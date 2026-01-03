import type { Error } from '@/types/errorType';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AuthService from './auth.service';

function useForgetPassword() {
  return useMutation({
    mutationKey: ['forgetPassword'],
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => {
      toast.info('check your email');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Inrernal server error');
    },
  });
}

export { useForgetPassword };
