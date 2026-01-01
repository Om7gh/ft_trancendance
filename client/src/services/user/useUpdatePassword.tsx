import { useMutation } from "@tanstack/react-query";
import api from "../clientHttpService";
import { toast } from "react-toastify";

async function updatePassword() {
    try {
        await api.patch("/profile/password")
    } catch(e) {
        throw e
    }
}

export function useUpdatePassword() {
   return useMutation({
       mutationKey: ['update-password'],
       mutationFn: updatePassword,
       onSuccess: () => {
         toast.success('Password updated successfully');
       },
       onError: (err: any) => {
         toast.error(err?.message ?? 'Failed to update password');
       },
     });
}