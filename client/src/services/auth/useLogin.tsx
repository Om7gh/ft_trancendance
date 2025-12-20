// useSignUp.ts
import { useMutation } from '@tanstack/react-query';
import type { signInData } from '@/types/userType';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { Error } from '@/types/errorType';

async function login(userData: signInData) {
  const res = await fetch('http://localhost:8080/auths/login', {
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
  const data = await res.json();
  return data;
}

function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: login,
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
