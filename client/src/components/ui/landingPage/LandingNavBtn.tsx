import { Button } from "@ui";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingNavBtn({
  fullWidth = false,
  mobile = false,
}: {
  fullWidth?: boolean;
  mobile?: boolean;
}): JSX.Element {
  const navigate = useNavigate();
  return (
    <ul
      className={`flex ${
        mobile ? "flex-col gap-3 w-full" : "gap-5"
      } tracking-wider items-center`}>
      <Button
        type="signIn"
        className={`${fullWidth ? "w-full" : ""} ${mobile ? "px-4 py-2" : ""}`}
        variant={mobile ? "outline" : "default"}
        onClick={(e) => {
          e.preventDefault();
          navigate("/auth/signin");
        }}>
        Sign In
      </Button>
      <Button
        type="signUp"
        className={`${fullWidth ? "w-full" : ""} ${mobile ? "px-4 py-2" : ""}`}
        variant={mobile ? "default" : "primary"}
        onClick={(e) => {
          e.preventDefault();
          navigate("/auth/signup");
        }}>
        Sign Up
      </Button>
    </ul>
  );
}
