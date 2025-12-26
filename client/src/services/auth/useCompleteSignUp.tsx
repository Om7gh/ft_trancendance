import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from './auth.service';

function useCompleteRegistration() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['set-avatar'],
    mutationFn: AuthService.completeProfile,
    onSuccess: () => {
      toast.success('Registration completed successfully');
      navigate('/dashboard');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export default useCompleteRegistration;
