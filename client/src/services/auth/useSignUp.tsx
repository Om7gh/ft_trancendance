import { useMutation } from "@tanstack/react-query";
import type { signUpData } from "@/types/userType";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { Error } from "@/types/errorType";

async function register(userData: signUpData) {
  console.log(userData);
  const res = await fetch("http://localhost:4000/api/v1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return await res.json();
}

function useSignUp() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: ["signUp"],
    mutationFn: register,
    onSuccess: (payload) => {
      toast.success(`Good start ${payload.username}`);
      document.cookie = `username=${encodeURIComponent(
        payload.username
      )}; max-age=3600; path=/`;
      document.cookie = `email=${encodeURIComponent(
        payload.email
      )}; max-age=3600; path=/`;
      navigate("/auth/activation");
    },
    onError: (error: Error) => {
      toast.error(error.message);
      if (error.statusCode === 401) {
        navigate("/auth/activation");
      }
      if (error.statusCode === 404) {
        navigate("/auth/signUp");
      }
    },
  });

  return mutation;
}

export default useSignUp;
