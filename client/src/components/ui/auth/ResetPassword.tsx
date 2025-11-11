import useCookie from "@/hooks/useUsersData";
import { useVerifyToken } from "@/services/auth/useVerifiyToken";
import { memo, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [params] = useSearchParams();
  const mutateVerifyToken = useVerifyToken();
  const token = useMemo(() => params.get("token"), [params]);
  const email = useCookie("email");

  useCallback(() => {
    if (!token) return;
    const data = {
      email: email as string,
      token: token as string,
    };
    mutateVerifyToken.mutate(data);
  }, [mutateVerifyToken, token, email]);

  if (mutateVerifyToken.isError) return <p>Not valid token</p>;
  return <div>ResetPassword</div>;
}

export default memo(ResetPassword);
