import { useState, useEffect } from "react";

function useCookie(name: string): string | undefined {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const found = cookies.find((cookie) => cookie.startsWith(name + "="));
    if (found) {
      const [, ...rest] = found.split("=");
      setValue(decodeURIComponent(rest.join("=")));
    }
  }, [name]);

  return value;
}

export default useCookie;
