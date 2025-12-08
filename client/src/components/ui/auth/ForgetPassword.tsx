import { memo, type JSX } from 'react';
import InputField from '../utils/InputField';
import Button from '../utils/Button';
import { useForgetPassword } from '@/services/auth/useForgerPassword';
import { Logo } from '@assets';
function ForgetPassword(): JSX.Element {
  const mutateForgetPassword = useForgetPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
    };

    mutateForgetPassword.mutate(data);
  };

  if (mutateForgetPassword.isError) {
    return <p className="text-red-500">Failed to send reset email.</p>;
  }
  if (mutateForgetPassword.isSuccess) {
    return <p className="text-green-500">Reset link sent! Check your inbox.</p>;
  }

  return (
    <div className="px-5 py-6 tracking-wider w-full text-slate-100 font-main">
      <img src={Logo} alt="logo" className="w-32 h-32 m-auto" />
      <div className="text-neon-100 text-xl text-center my-5 bg-linear-90 from-violet-500 to-neon bg-clip-text text-transparent space-y-1">
        <p>Poor player! Forgot your password?</p>
        <p>No worries.</p>
      </div>

      <form className="text-slate-100" onSubmit={handleSubmit}>
        <InputField
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Player email"
        />

        <Button
          type="signUp"
          variant="primary"
          className="inline-block my-5 w-full"
        >
          Send mail
        </Button>
      </form>
    </div>
  );
}

export default memo(ForgetPassword);
