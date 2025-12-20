import type { Error } from '@/types/errorType';
import type { activationUSerData } from '@/types/userType';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

async function twoFactor(data: activationUSerData) {
  const res = await fetch('http://localhost:8080/auths/2fa/verify-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      credentials: 'include',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return await res.json();
}

function useTwoFactorAuth() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: twoFactor,
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
