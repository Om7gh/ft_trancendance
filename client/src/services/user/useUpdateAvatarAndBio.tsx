import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from "../auth/auth.service";
import { toast } from "react-toastify";
import { useContext } from "react";
import { GlobalContext } from "@/App";

export function useUpdateBioAndAvatar() {
    const client = useQueryClient();
    const {user, setUser}= useContext(GlobalContext)
    return useMutation({
        mutationKey: ["update-avatar-bio"],
        mutationFn: AuthService.updateProfile,
        onSuccess: (payload) => {
            console.log("avatar here ...", payload)
        // @ts-expect-error
        setUser(prev => ({...prev, avatar: payload.avatar,
            bio: payload.bio, }));
        // toast.success("Avatar or bio updated successfully")
        },
        onError: (err) => {
            toast.error(err.message || "error")
        }
    })
}