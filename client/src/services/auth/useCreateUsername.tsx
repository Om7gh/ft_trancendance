import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AuthService from './auth.service';

function useCreateUsername() {
  return useMutation({
    mutationKey: ['set-username'],
    mutationFn: AuthService.setUsername,
    onSuccess: () => {
      toast.success('username created successfully');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export default useCreateUsername;
