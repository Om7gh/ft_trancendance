import { type ReactElement, type ReactNode } from "react";

type BoxTypes = {
  children: ReactNode | ReactElement;
};
export default function Box({ children }: BoxTypes) {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-x-5 w-5/6 m-auto">
      {children}
    </div>
  );
}
