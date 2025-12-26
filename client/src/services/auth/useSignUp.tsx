import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { Error } from '@/types/errorType';
import { useTransStore } from '@/store/useTransStore';
import AuthService from './auth.service';

function useSignUp() {
  const setRegisterSuccess = useTransStore((state) => state.setRegisterSuccess);
  const mutation = useMutation({
    mutationKey: ['signUp'],
    mutationFn: AuthService.register,
    onSuccess: (payload) => {
      toast.success(`Good start ${payload.username}`);
      setRegisterSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

export default useSignUp;
