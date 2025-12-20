import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

async function createUsername(data: { username: string }) {
  console.log(data);
  const res = await fetch('http://localhost:8080/auths/set-username', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!res.ok) throw await res.json();
  return await res.json();
}

function useCreateUsername() {
  return useMutation({
    mutationKey: ['set-username'],
    mutationFn: createUsername,
    onSuccess: () => {
      toast.success('username created successfully');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export default useCreateUsername;
