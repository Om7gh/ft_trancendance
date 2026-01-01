import { useMutation } from "@tanstack/react-query"
import AuthService from "../auth/auth.service"

export function useSendEnable2fa() {
  return useMutation({
    mutationFn: AuthService.setupTwoFa,
  })
}

export function useVerifyEnable2fa() {
  return useMutation({
    mutationFn: AuthService.verifyTwoFa,
  })
}

export function useDisable2fa() {
  return useMutation({
    mutationFn: AuthService.disableTwoFa,
  })
}