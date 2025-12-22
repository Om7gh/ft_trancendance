import { useEffect } from "react";

function createConnection(url: string, connection: { ws: WebSocket | null }) {
  try {
    connection.ws = new WebSocket(url);
    connection.ws.onerror = () => console.log('Connection error!!');
    connection.ws.onopen = () => console.log('Connection established!!');
    connection.ws.onclose = () => console.log('Connection closed!!');
  } catch (err) {
    throw ("Fail to Create connection")
  }
}

export default function useWebSocket(
    url: string,
    connection: {ws: WebSocket | null},
    setMatchState: (value: string) => void,
    setError: (value: string) => void,
) {
    useEffect(() => {
        try {
          createConnection(url, connection);
          setMatchState("waiting");
          return () => {
            if (connection.ws) {
              connection.ws.close(1000, 'Component unmounted!!');
            }
          }
        } catch (err) {
          console.error(err);
          setError("An error during connection establishing, see console!!");
        }
      }, [url]);
}