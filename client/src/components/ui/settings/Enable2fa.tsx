import { useContext, useMemo, useState, type FormEvent } from "react"
import { InputField } from "../utils/Button"
import { GlobalContext } from "@/App"
import { useDisable2fa, useSendEnable2fa, useVerifyEnable2fa } from "@/services/user/useEnable2fa"
import type { Setup2FAResponse } from "@/types/userType"

function extractQrFromSetup(data: Setup2FAResponse | undefined): {
  qrcode?: string
  html?: string
} {
  if (!data) return {}

  if (typeof data === "string") {
    return { html: data }
  }

  return { qrcode: data.qrcode, html: data.html }
}

function Enable2fa() {
  const [code, setCode] = useState("")
  const [enabled, setEnabled] = useState(false)

  const {user} = useContext(GlobalContext)
  const isMfaEnabled = Boolean(user?.mfa_enabled)

  const setupMutation = useSendEnable2fa()
  const verifyMutation = useVerifyEnable2fa()
  const disableMutation = useDisable2fa()

  const setupPayload = setupMutation.data as Setup2FAResponse | undefined
  const { qrcode, html } = useMemo(() => extractQrFromSetup(setupPayload), [setupPayload])
  const hasQr = Boolean(qrcode || html)

  const handleChange = (e: FormEvent<any>) => {
          const target = e.target as unknown as HTMLInputElement | null
          if (!target) return
          if (target.id !== "enable2fa") return

          setEnabled(target.checked)
          if (!target.checked) {
            setCode("")
            setupMutation.reset()
            verifyMutation.reset()
            disableMutation.reset()
          }
        }
      
  const handleSubmit = (e: FormEvent<any>) => {
          e.preventDefault()
          if (isMfaEnabled) {
            if (!code.trim()) return
            disableMutation.mutate(code.trim(), {
              onSuccess: async () => {
                setCode("")
              },
            })
            return
          }

          if (!enabled) return

          if (!hasQr) {
            setupMutation.mutate()
            return
          }

          if (!code.trim()) return
          verifyMutation.mutate(code.trim(), {
            onSuccess: async () => {
              setEnabled(false)
              setCode("")
              setupMutation.reset()
            },
          })
        }

  return (
    <div className="flex-1 p-6 m-auto">
      <form
        className="flex flex-col gap-5"
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="text-slate-200">
            <span className="font-medium">2FA status:</span>{" "}
            <span className={isMfaEnabled ? "text-emerald-400" : "text-slate-400"}>
              {isMfaEnabled ? "enabled" : "disabled"}
            </span>
          </div>

          {!isMfaEnabled && (
            <div className="flex items-center gap-3">
              <InputField
                type="checkbox"
                name="enable2fa"
                id="enable2fa"
                className="shrink-0"
              />
              <label
                htmlFor="enable2fa"
                className="text-slate-200 select-none cursor-pointer"
              >
                Enable 2FA
              </label>
            </div>
          )}
        </div>

        {isMfaEnabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Authenticator code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        )}

        {!isMfaEnabled && enabled && hasQr && (
          <div className="space-y-4">
            {qrcode ? (
              <div className="w-full flex justify-center">
                <img src={qrcode} alt="2FA QR code" className="w-40 h-40" />
              </div>
            ) : html ? (
              <div
                className="w-full flex justify-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : null}

            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Authenticator code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        )}

        {setupMutation.isError && (
          <p className="text-sm text-rose-400">
            {(setupMutation.error as any)?.response?.data?.message ||
              (setupMutation.error as any)?.message ||
              "Failed to setup 2FA"}
          </p>
        )}
        {verifyMutation.isError && (
          <p className="text-sm text-rose-400">
            {(verifyMutation.error as any)?.response?.data?.message ||
              (verifyMutation.error as any)?.message ||
              "Invalid code"}
          </p>
        )}
        {disableMutation.isError && (
          <p className="text-sm text-rose-400">
            {(disableMutation.error as any)?.response?.data?.message ||
              (disableMutation.error as any)?.message ||
              "Failed to disable 2FA"}
          </p>
        )}
        {verifyMutation.isSuccess && (
          <p className="text-sm text-emerald-400">2FA enabled successfully</p>
        )}
        {disableMutation.isSuccess && (
          <p className="text-sm text-emerald-400">2FA disabled successfully</p>
        )}

        <button
          type="submit"
          disabled={(isMfaEnabled
              ? disableMutation.isPending
              : !enabled || setupMutation.isPending || verifyMutation.isPending)
          }
          className="mt-4 rounded-lg bg-violet-600 text-slate-100 hover:bg-violet-700 transition px-4 py-2 shadow-xl shadow-slate-900 disabled:opacity-50"
        >
          {isMfaEnabled
            ? disableMutation.isPending
              ? "Disabling…"
              : "Disable"
            : !enabled
              ? "Enable"
              : !hasQr
                ? setupMutation.isPending
                  ? "Generating…"
                  : "Generate QR"
                : verifyMutation.isPending
                  ? "Verifying…"
                  : "Confirm"}
        </button>
      </form>
    </div>
  )
}

export default Enable2fa