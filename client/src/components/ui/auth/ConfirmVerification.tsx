import AuthService from '@/services/auth/auth.service';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useSearchParams } from 'react-router-dom';

function useConfirmEmail(token: string) {
    return useQuery({
        queryKey: ['confirm-email'],
        queryFn: () => AuthService.confirmEmail(token),
        enabled: true,
    });
}

function ConfirmVerification() {
    const [params] = useSearchParams();
    const token = params?.get('token') as string;
    const { isSuccess, isError } = useConfirmEmail(token);

    console.log(isSuccess, isError);

    if (isSuccess) return <Navigate to="/auth/complete-registration" />;
    else if (isError) return <Navigate to="/auth/signin" />;
    else return null;
}

export default ConfirmVerification;
