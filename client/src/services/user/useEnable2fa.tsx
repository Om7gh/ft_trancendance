import { useContext } from "react"
import { useMutation } from "@tanstack/react-query"
import AuthService from "../auth/auth.service"
import { GlobalContext } from "@/App"
import { toast } from "react-toastify"

export function useSendEnable2fa() {
  return useMutation({
    mutationFn: AuthService.setupTwoFa,
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message
      if (error?.response?.status === 429) {
        toast.error(message || "Too many requests. Please try again later.")
      } else {
        toast.error(message || "Failed to setup 2FA")
      }
    },
  })
}

export function useVerifyEnable2fa() {
  const { setUser } = useContext(GlobalContext)
  
  return useMutation({
    mutationFn: AuthService.verifyTwoFa,
    onSuccess: () => {
      setUser((prev) => prev ? { ...prev, mfa_enabled: true } : null)
      toast.success("2FA enabled successfully")
    },
  })
}

export function useDisable2fa() {
  const { setUser } = useContext(GlobalContext)
  
  return useMutation({
    mutationFn: AuthService.disableTwoFa,
    onSuccess: () => {
      setUser((prev) => prev ? { ...prev, mfa_enabled: false } : null)
      toast.success("2FA disabled successfully")
    },
  })
}