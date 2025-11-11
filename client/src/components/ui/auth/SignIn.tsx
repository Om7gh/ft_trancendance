import { useState } from "react";
import { Form, Link, useNavigation } from "react-router-dom";
import { Logo } from "@assets";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import InputField from "../utils/InputField";
import useLogin from "@/services/auth/useLogin";
import ForgetPassword from "./ForgetPassword";
import Model from "../utils/Model";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const navigation = useNavigation();
  const mutate = useLogin();
  const isSubmitting = navigation.state === "submitting";
  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    mutate.mutate(userData);
  };

  return (
    <div className="w-[700px] bg-gradient-to-b from-slate-800/50 to-teal-800/50py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center rounded-3xl">
      {openModel && (
        <Model>
          <ForgetPassword setOpenModel={setOpenModel} />
        </Model>
      )}

      <div className="relative max-w-md w-full mt-16 space-y-8 backdrop-blur-sm p-8 rounded-xl border border-teal-400/20 shadow-2xl shadow-teal-400/10">
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-teal-400 rounded-r-lg" />
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-orange-400 rounded-l-lg" />

        <div className="flex flex-col items-center">
          <img src={Logo} alt="logo" className="w-[15vw]" />

          <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
            Game On!
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Ready to play? Sign in or{" "}
            <Link
              to="/auth/signup"
              className="font-medium text-teal-400 hover:text-teal-300 underline underline-offset-4">
              join the tournament
            </Link>
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6" onSubmit={handleSumbit}>
          <div className="space-y-4">
            <div className="relative">
              <InputField
                id="username"
                name="username"
                type="username"
                autoComplete="username"
                placeholder="Player email"
                className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-teal-400 focus:border-teal-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🎾</span>
              </div>
              {mutate?.error && (
                <p className="mt-1 text-sm text-red-400">
                  {mutate.error.message}
                </p>
              )}
            </div>

            <div className="relative">
              <InputField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Secret smash"
                className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-teal-400 focus:border-teal-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔑</span>
              </div>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {mutate?.error && (
                <p className="mt-1 text-sm text-red-400">
                  {mutate.error.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <InputField
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-400 focus:ring-teal-400 border-gray-600 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-300">
                Remember my score
              </label>
            </div>

            <div className="text-sm" onClick={() => setOpenModel(true)}>
              <p className="font-medium text-orange-400 hover:text-orange-300">
                Forgot your move?
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-orange-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading your paddle...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">🏓</span>
                  Serve & Sign In
                </span>
              )}
            </button>
          </div>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 text-sm text-slate-400 bg-gray-800/70">
              Or challenge with
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-slate-600 px-5 py-3 text-slate-100 rounded-lg">
          <span className="mr-2 text-orange-400">G</span> Google
        </button>
      </div>
    </div>
  );
}
