
import { useVerifyToken } from '@/services/auth/useVerifiyToken';
import {  useMemo, useState } from 'react';
import { useNavigation, useSearchParams } from 'react-router-dom';
import InputField from '../utils/InputField';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Logo } from '@assets';

function ResetPassword() {
  const [params] = useSearchParams();
  const mutateVerifyToken = useVerifyToken();
  const token = useMemo(() => params.get('token'), [params]);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="relative max-w-md w-full mt-16 space-y-8 backdrop-blur-sm p-8  border border-violet-400/20 shadow-2xl shadow-violet-400/10">
      <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-violet-400 rounded-r-lg" />
      <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-neon rounded-l-lg" />

      <div className="flex flex-col items-center">
        <img src={Logo} alt="logo" className="w-[12vw]" />

        <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-neon">
          Change your move!
        </h2>
      </div>
      <form method="post" className="mt-8 space-y-6" onSubmit={handleSumbit}>
        <div className="space-y-4">
          <div className="relative">
            <InputField
              id="newpassword"
              name="newpassword"
              type="password"
              autoComplete="newpassword"
              placeholder="new move"
              className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-violet-400 focus:border-violet-400"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🎾</span>
            </div>
          </div>

          <div className="relative">
            <InputField
              id="confirmNewPassword"
              name="confirmNewPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="confirm your move"
              className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-violet-400 focus:border-violet-400"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔑</span>
            </div>
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-violet-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400 to-neon  blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium  text-white bg-gray-800 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading your paddle...
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">🏓</span>
                Reset password
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
