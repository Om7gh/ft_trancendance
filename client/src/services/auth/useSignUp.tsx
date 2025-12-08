import { useMutation } from '@tanstack/react-query';
import type { signUpData } from '@/types/userType';
import { toast } from 'react-toastify';
import type { Error } from '@/types/errorType';
import { useTransStore } from '@/store/useTransStore';
async function register(userData: signUpData) {
  const res = await fetch('http://localhost:8080/auths/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return await res.json();
}

function useSignUp() {
  const setRegisterSuccess = useTransStore((state) => state.setRegisterSuccess);
  const mutation = useMutation({
    mutationKey: ['signUp'],
    mutationFn: register,
    onSuccess: (payload) => {
      toast.success(`Good start ${payload.username}`);
      // document.cookie = `username=${encodeURIComponent(
      //   payload.username
      // )}; max-age=3600; path=/`;
      // document.cookie = `email=${encodeURIComponent(
      //   payload.email
      // )}; max-age=3600; path=/`;
      setRegisterSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

export default useSignUp;
