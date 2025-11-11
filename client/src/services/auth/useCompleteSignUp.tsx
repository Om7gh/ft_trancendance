import { useMutation } from "@tanstack/react-query";
import type { completeProfile } from "@/types/userType";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { Error } from "@/types/errorType";

async function fillAvatar(userData: completeProfile) {
  const res = await fetch(
    `http://localhost:4000/api/v1/users/complete-profile/${username}`,
    {
      method: "POST",
      body: userData,
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw err;
  }
  return await res.json();
}

function useCompleteProfile() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fillAvatar,
    onSuccess: (data) => {
      toast.success(`Welcome to the tournament, ${data.username}!`);
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Internal server error.");
      console.log(error.statusCode);
    },
  });
}

export { useCompleteProfile };
