import { useQuery } from '@tanstack/react-query';
import AuthService from '../auth/auth.service';

function useGetProfile(username: string) {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => AuthService.getProfile(username),
        retry: (failureCount: number, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 2;
        },
    });
}

export default useGetProfile;
