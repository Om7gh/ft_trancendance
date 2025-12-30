import { useEffect } from "react";

function useEventListener(target: EventTarget | null, event: string, handler: (e: any) => void){
  
  useEffect(() => {
    if (target !== null && target !== undefined)
      target.addEventListener(event, handler);
    return (() => {
      if (target !== null && target !== undefined )
        target.removeEventListener(event, handler);
    });
  }, [target, event, handler])
}

export default useEventListener;