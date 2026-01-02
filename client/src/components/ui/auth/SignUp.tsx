import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@assets';
import InputField from '../utils/InputField';
import useSignUp from '@/services/auth/useSignUp';
import { useTransStore } from '@/store/useTransStore';
import Modal from '@/components/layout/Modal';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineDiscord } from 'react-icons/ai';

function CheckMail({ email }: { email: string | undefined }) {
  const navigate = useNavigate();
  const handleOpenMail = () => {
      const mailUrl = 'https://mail.google.com';
      window.open(mailUrl, '_blank');
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <img src={Logo} alt="logo" className="w-25 h-25" />
      <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
      <p className="text-slate-300 text-center">
        We sent a confirmation link to{' '}
        <span className="font-semibold text-neon">{email}</span>
      </p>

      <button
        onClick={handleOpenMail}
        className=" mt-6 px-8 py-3 bg-linear-to-r from-violet-500 to-neon text-white cursor-pointer  font-semibold hover:shadow-lg transition-all duration-300"
      >
        Open Email Client
      </button>

      <p className="text-sm text-slate-400 mt-4">
        Didn't receive it?{' '}
        <button
          onClick={() => navigate('/auth/signUp')}
          className="text-neon hover:underline"
        >
          Try again
        </button>
      </p>
    </div>
  );
}

export default function SignUp() {
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const registerSuccess = useTransStore((state) => state.registerSuccess);
  const setRegisterSuccess = useTransStore((state) => state.setRegisterSuccess);
  const [email, setEmail] = useState('');
  const signupMutation = useSignUp();
  const isSubmitting = signupMutation.isPending;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);
    setEmail(formData.get('email') as string);
    const userData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      password,
    };
    console.log(userData)
    signupMutation.mutate(userData);
    setEmail("")
  };

  return (
    <div className="w-150 bg-linear-to-b from-slate-900/50 to-violet-800/20 py-12 px-4 sm:px-6 lg:px-8 font-main flex items-center justify-center rounded-3xl relative overflow-hidden">
      {registerSuccess && (
        <Modal onClose={() => setRegisterSuccess()}>
          <CheckMail email={email} />
        </Modal>
      )}
      <div className="relative max-w-md w-full mt-16 space-y-8 backdrop-blur-sm p-8  border border-violet-400/20 shadow-2xl shadow-violet-400/10">
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-violet-400 rounded-r-lg" />
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-neon rounded-l-lg" />

        <div className="flex flex-col items-center">
          <img src={Logo} alt="logo" className="w-52 h-52" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-neon">
            Join Us Now!
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Already a player?{' '}
            <Link
              to="/auth/signin"
              className="font-medium text-violet-400 hover:text-violet-300 underline underline-offset-4"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-6">
              <div className="relative">
                <InputField
                  id="firstname"
                  name="first_name"
                  type="text"
                  autoComplete="username"
                  placeholder="Player first name"
                  className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-violet-400 focus:border-violet-400"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">👑</span>
                </div>
                {signupMutation.error?.message?.includes('username') && (
                  <p className="mt-1 text-sm text-red-400">
                    {signupMutation.error.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <InputField
                  id="lastname"
                  name="last_name"
                  type="text"
                  autoComplete="lastname"
                  placeholder="Player last name"
                  className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-violet-400 focus:border-violet-400"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">👑</span>
                </div>
                {signupMutation.error?.message?.includes('username') && (
                  <p className="mt-1 text-sm text-red-400">
                    {signupMutation.error.message}
                  </p>
                )}
              </div>
            </div>

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
                <span className="text-gray-400">✉️</span>
              </div>
              {signupMutation.error?.message?.includes('email') && (
                <p className="mt-1 text-sm text-red-400">
                  {signupMutation.error.message}
                </p>
              )}
            </div>

            <div className="relative">
              <InputField
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Secret smash"
                className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-violet-400 focus:border-violet-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔑</span>
              </div>
              {signupMutation.error?.message?.includes('password') && (
                <p className="mt-1 text-sm text-red-400">
                  {signupMutation.error.message}
                </p>
              )}
            </div>

            <div className="relative">
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Confirm secret smash"
                className={`pl-10 bg-gray-700/50 border-gray-600 focus:ring-violet-400 focus:border-violet-400 ${
                  !passwordsMatch ? 'border-red-400' : ''
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔏</span>
              </div>
              {!passwordsMatch && (
                <p className="mt-1 text-sm text-red-400">
                  Passwords don't match!
                </p>
              )}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-violet-400 to-neon  blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium  text-slate-100 bg-slate-900  cursor-pointer ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-100"
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
                  Registering...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">🏓</span>
                  Join The Game
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 text-sm text-slate-400 bg-slate-800/70">
              Or sign up with
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
