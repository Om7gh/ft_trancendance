import type { Error } from "@/types/errorType";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

async function verifyToken(data: { email: string; token: string }) {
  const res = await fetch(
    "http://localhost:4000/api/v1/auth/validate-reset-token",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw err;
  }
  return await res.json();
}

function useVerifyToken() {
  return useMutation({
    mutationKey: ["forgetPassword"],
    mutationFn: verifyToken,
    onSuccess: () => {
      toast.info("check your email");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Inrernal server error");
    },
  });
}

export { useVerifyToken };
