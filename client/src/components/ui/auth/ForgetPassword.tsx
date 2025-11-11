import { memo, type JSX } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import InputField from "../utils/InputField";
import Button from "../utils/Button";
import { useForgetPassword } from "@/services/auth/useForgerPassword";

interface ForgetPasswordProps {
  setOpenModel: (open: boolean) => void;
}

function ForgetPassword({ setOpenModel }: ForgetPasswordProps): JSX.Element {
  const mutateForgetPassword = useForgetPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
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
    <div className="px-5 py-6 tracking-wider w-full">
      <IoMdCloseCircle
        onClick={() => setOpenModel(false)}
        className="text-3xl text-orange-500 bg-slate-950 cursor-pointer rounded-full"
      />

      <div className="text-orange-100 text-xl text-center my-5">
        <p>Poor player! Forgot your password?</p>
        <p>No worries.</p>
      </div>

      <div className="bg-slate-100 h-[1px] w-full my-6" />

      <form className="text-slate-100" onSubmit={handleSubmit}>
        <p className="text-orange-100 text-center mb-3">
          Send us your email to receive a password reset link
        </p>

        <InputField
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Player email"
          className="pl-10 bg-gray-700/50 border-gray-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 mt-2"
        />

        <Button type="signUp" variant="primary" className="inline-block my-5">
          Send mail
        </Button>
      </form>
    </div>
  );
}

export default memo(ForgetPassword);
