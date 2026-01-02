import { useMutation } from "@tanstack/react-query";
import AuthService from "../auth/auth.service";
import { toast } from "react-toastify";


export function useUpdatePassword(onErrorCallback?: (error: string) => void) {
   return useMutation({
       mutationKey: ['update-password'],
       mutationFn: AuthService.updatePassword,
       onSuccess: () => {
         toast.success('Password updated successfully');
       },
       onError: (err: any) => {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update password';
        if (onErrorCallback) {
          onErrorCallback(errorMessage);
        }
       },
     });
}