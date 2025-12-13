import { useQuery } from '@tanstack/react-query';

const verifyAuth = async function () {
  const user = await fetch('http://localhost:8080/auths/userinfo', {
    method: 'GET',
    credentials: 'include',
  });
  if (!user.ok) {
    if (user.status === 401) {
      const newRes = await fetch('http://localhost:8080/token/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      if (!newRes.ok) throw new Error('Token expired');
      return await newRes.json();
    } else throw new Error('Invalid Token');
  }
  return await user.json();
};

function useAuthenticated() {
  return useQuery({
    queryKey: ['user'],
    queryFn: verifyAuth,
  });
}

export default useAuthenticated;
