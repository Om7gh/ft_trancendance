import { useRef, useState } from "react";
import { toast } from "react-toastify";
import type { activationUSerData } from "@/types/userType";
import { useTwoFactorAuth } from "@/services/auth/useTwoFactorAuth";
import useCookie from "@/hooks/useUsersData";

function ActivationInput({
  name,
  value,
  onChange,
  onKeyDown,
  autoFocus,
  ref,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  ref: () => void;
}) {
  return (
    <input
      type="text"
      name={name}
      maxLength={1}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
      className="border-2 border-orange-300 w-12 h-12 mx-1 text-center rounded-md text-xl focus:border-orange-500 focus:outline-none text-slate-200"
      ref={ref}
    />
  );
}

export default function TwoFactorActivation() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const mutateActivate = useTwoFactorAuth();
  const email = useCookie("email");
  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let activationArr = [];
    for (let i = 0; i < 6; i++) activationArr.push(formData.get(`n-${i}`));
    const verificationCode = activationArr.join("");
    const sendData: activationUSerData = {
      email: email as string,
      verificationCode: verificationCode as string,
    };
    mutateActivate.mutate(sendData);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-slate-200 mb-2">
          Please check your email and enter the verification code
        </h3>
        <a
          href="#"
          className="text-orange-500 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            toast.info("New code has been send to your email");
          }}>
          Didn't receive a code? Click here to resend
        </a>
      </div>

      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="flex mb-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ActivationInput
              key={`n-${index}`}
              name={`n-${index}`}
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              autoFocus={index === 0}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={mutateActivate.status === "pending" || code.some((c) => !c)}
          className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300 transition-colors">
          {mutateActivate.status === "pending" ? "Verifying..." : "Verify"}
        </button>
      </form>

      {mutateActivate?.error && (
        <p className="mt-4 text-red-500">{mutateActivate.error.message}</p>
      )}
    </div>
  );
}
