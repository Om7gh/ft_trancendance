import { useEffect, useState } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function isMobileScreen() {
      const mobileWidth = 763;
      setIsMobile(window.innerWidth < mobileWidth);
    }
    isMobileScreen();

    window.addEventListener("resize", isMobileScreen);
    return () => window.removeEventListener("resize", isMobileScreen);
  }, []);
  return isMobile;
}
