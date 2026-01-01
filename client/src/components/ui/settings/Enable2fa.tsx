import { useContext, useMemo, useState, type FormEvent } from "react"
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
  const [showSetup, setShowSetup] = useState(false)
  const [showDisable, setShowDisable] = useState(false)

  const { user } = useContext(GlobalContext)
  const isMfaEnabled = Boolean(user?.mfa_enabled)

  const setupMutation = useSendEnable2fa()
  const verifyMutation = useVerifyEnable2fa()
  const disableMutation = useDisable2fa()

  const setupPayload = setupMutation.data as Setup2FAResponse | undefined
  const { qrcode, html } = useMemo(() => extractQrFromSetup(setupPayload), [setupPayload])
  const hasQr = Boolean(qrcode || html)

  const handleEnableClick = () => {
    setShowSetup(true)
    setupMutation.mutate()
  }

  const handleDisableClick = () => {
    setShowDisable(true)
  }

  const handleCancel = () => {
    setShowSetup(false)
    setShowDisable(false)
    setCode("")
    setupMutation.reset()
    verifyMutation.reset()
    disableMutation.reset()
  }

  const handleVerify = (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    verifyMutation.mutate(code.trim(), {
      onSuccess: () => {
        setCode("")
        setShowSetup(false)
        setupMutation.reset()
      },
    })
  }

  const handleDisable = (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    disableMutation.mutate(code.trim(), {
      onSuccess: () => {
        setCode("")
        setShowDisable(false)
      },
    })
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-slate-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Status:</span>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isMfaEnabled
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
                }`}
              >
                {isMfaEnabled ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {!isMfaEnabled && !showSetup && (
              <button
                onClick={handleEnableClick}
                disabled={setupMutation.isPending}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 
                         text-white font-medium transition-colors shadow-lg shadow-violet-900/30
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {setupMutation.isPending ? "Setting up..." : "Enable 2FA"}
              </button>
            )}

            {isMfaEnabled && !showDisable && (
              <button
                onClick={handleDisableClick}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 
                         text-white font-medium transition-colors shadow-lg shadow-rose-900/30"
              >
                Disable 2FA
              </button>
            )}
          </div>
        </div>

        {showSetup && hasQr && (
          <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 
                        animate-in fade-in slide-in-from-top-4 duration-300">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">
              Scan QR Code
            </h4>
            <p className="text-sm text-slate-400 mb-6">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>

            <div className="flex justify-center mb-6">
              {qrcode ? (
                <div className="p-4 bg-white rounded-xl">
                  <img src={qrcode} alt="2FA QR code" className="w-48 h-48" />
                </div>
              ) : html ? (
                <div
                  className="p-4 bg-white rounded-xl"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : null}
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Enter 6-digit code
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  maxLength={6}
                  className="w-full p-3 rounded-lg bg-slate-800 text-slate-100 border border-slate-700
                           focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                           text-center text-2xl tracking-widest font-mono"
                />
              </div>

              {verifyMutation.isError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  <p className="text-sm text-rose-400">
                    {(verifyMutation.error as any)?.response?.data?.message ||
                      (verifyMutation.error as any)?.message ||
                      "Invalid code. Please try again."}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 
                           text-slate-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={code.length !== 6 || verifyMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 
                           text-white font-medium transition-colors shadow-lg shadow-violet-900/30
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyMutation.isPending ? "Verifying..." : "Verify & Enable"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Disable Flow */}
        {showDisable && (
          <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50
                        animate-in fade-in slide-in-from-top-4 duration-300">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">
              Disable Two-Factor Authentication
            </h4>
            <p className="text-sm text-slate-400 mb-6">
              Enter the 6-digit code from your authenticator app to disable 2FA
            </p>

            <form onSubmit={handleDisable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Authenticator code
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  maxLength={6}
                  className="w-full p-3 rounded-lg bg-slate-800 text-slate-100 border border-slate-700
                           focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                           text-center text-2xl tracking-widest font-mono"
                />
              </div>

              {disableMutation.isError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  <p className="text-sm text-rose-400">
                    {(disableMutation.error as any)?.response?.data?.message ||
                      (disableMutation.error as any)?.message ||
                      "Invalid code. Please try again."}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 
                           text-slate-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={code.length !== 6 || disableMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 
                           text-white font-medium transition-colors shadow-lg shadow-rose-900/30
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {disableMutation.isPending ? "Disabling..." : "Disable 2FA"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Enable2fa