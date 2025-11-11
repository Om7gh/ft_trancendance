import type { Error } from "@/types/errorType";
import type { activationUSerData } from "@/types/userType";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

async function twoFactor(data: activationUSerData) {
  const res = await fetch("http://localhost:4000/api/v1/auth/2fa/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return await res.json();
}

function useTwoFactorAuth() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: twoFactor,
    onSuccess: () => {
      toast.success(`Welcome to the tournament!`);
      navigate("/auth/avatar");
      window.localStorage.removeItem("pingpong_email");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Activation failed. Please try again.");
    },
  });
}

export { useTwoFactorAuth };
