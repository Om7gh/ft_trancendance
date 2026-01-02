import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { Error } from '@/types/errorType';
import AuthService from './auth.service';
import { useNavigate } from 'react-router-dom';

function useVerifyToken() {
    const navigate = useNavigate()
  return useMutation({
    mutationFn: AuthService.verifyToken,
    onError: (error: Error) => {
      console.log(error)
      toast.error(error.message || 'Failed to reset password');
      navigate("/auth/signin")
    },
  });
}

export default useVerifyToken;
