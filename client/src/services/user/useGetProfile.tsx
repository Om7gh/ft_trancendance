import { useQuery } from '@tanstack/react-query';
import AuthService from '../auth/auth.service';

function useGetProfile(username: string) {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => AuthService.getProfile(username),
    });
}

export default useGetProfile;
