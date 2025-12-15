import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

async function completeRegistration(data: {
  bio: string;
  avatar: File | null;
}) {
  const res = await fetch('http://localhost:8080/auths/complete-profile', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!res.ok) throw await res.json();
  return await res.json();
}

function useCompleteRegistration() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['set-avatar'],
    mutationFn: completeRegistration,
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
