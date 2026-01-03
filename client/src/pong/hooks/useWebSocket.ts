import { useEffect } from "react";

export default function useWebSocket(
  url: string,
  connection: {ws: WebSocket | null},
  setMatchState: (value: string) => void,
  setError: (value: string) => void,
) {
  useEffect(() => {
    try {
      connection.ws = new WebSocket(url);
      setMatchState("waiting");
      return () => {
        if (connection.ws) {
          connection.ws.close(1000, 'Component is unmounted!!');
        }
      }
    } catch (err: any) {
      setError("Fail To Establish Connection!!");
    }
  }, [url]);
}