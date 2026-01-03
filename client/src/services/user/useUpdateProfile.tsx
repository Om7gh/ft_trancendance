import { useMutation } from "@tanstack/react-query";
import AuthService from "../auth/auth.service";
import { toast } from "react-toastify";
import { useContext } from "react";
import { GlobalContext } from "@/App";

export function useUpdateProfile(onErrorCallback?: (error: string) => void) {
    const {setUser}= useContext(GlobalContext)
    return useMutation({
        mutationKey: ["update-avatar-bio"],
        mutationFn: AuthService.updateProfile,
        onSuccess: (response: any) => {
            // @ts-expect-error
            setUser(prev => ({
                ...prev,
                avatar: response.avatar,
                bio: response.bio,
                first_name: response.first_name,
                last_name: response.last_name
            }));
            toast.success("Profile updated successfully")
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update password';
            if (onErrorCallback) {
                onErrorCallback(errorMessage);
            }
        }
    })
}
