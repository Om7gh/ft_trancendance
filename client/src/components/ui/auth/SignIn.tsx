import { useState } from 'react';
import { Link, useNavigation } from 'react-router-dom';
import { Logo } from '@assets';
import InputField from '../utils/InputField';
import useLogin from '@/services/auth/useLogin';
import ForgetPassword from './ForgetPassword';
import Model from '../../layout/Modal';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineDiscord } from 'react-icons/ai';

export default function SignIn() {
  const [openModel, setOpenModel] = useState(false);
  const navigation = useNavigation();
  const mutate = useLogin();
  const isSubmitting = navigation.state === 'submitting'; // 'idle, submitting'
  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    mutate.mutate(userData);
  };

  return (
    <div className="w-[600px] bg-gradient-to-b from-slate-800/50 to-violet-800/20 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center rounded-3xl">
      {openModel && (
        <Model onClose={() => setOpenModel(false)}>
          <ForgetPassword />
        </Model>
      )}

      <div className="relative max-w-md w-full mt-16 space-y-8 backdrop-blur-sm p-8  border border-violet-400/20 shadow-2xl shadow-violet-400/10">
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-violet-400 rounded-r-lg" />
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-neon rounded-l-lg" />

        <div className="flex flex-col items-center">
          <img src={Logo} alt="logo" className="w-52 h-52" />

          <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-neon">
            Game On!
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Ready to play? Sign in or{' '}
            <Link
              to="/auth/signup"
              className="font-medium text-violet-400 hover:text-violet-300 underline underline-offset-4"
            >
              join the tournament
            </Link>
          </p>
        </div>

        <form method="post" className="mt-8 space-y-6" onSubmit={handleSumbit}>
          <div className="space-y-4">
            <div className="relative">
              <InputField
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Player email"
                className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-violet-400 focus:border-violet-400"
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
                type="password"
                autoComplete="current-password"
                placeholder="Secret smash"
                className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-violet-400 focus:border-violet-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔑</span>
              </div>

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
                className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-gray-600 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-300"
              >
                Remember my score
              </label>
            </div>

            <div className="text-sm" onClick={() => setOpenModel(true)}>
              <p className="font-medium text-neon hover:text-neon-300">
                Forgot your move?
              </p>
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
                  Serve & Sign In
                </span>
              )}
            </button>
          </div>
        </form>

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

        <div className="flex items-center justify-evenly">
          <a
            href="/api/oauth2/google"
            className="bg-linear-180 from-violet-900 to-slate-950 p-2 shadow-lg shadow-violet-900"
          >
            <FcGoogle className="w-12 h-12" />
          </a>
          <a
            href="/api/oauth2/discord"
            className="bg-linear-180 from-violet-900 to-slate-950 p-2 shadow-lg shadow-violet-900"
          >
            <AiOutlineDiscord className="w-12 h-12 text-violet-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
