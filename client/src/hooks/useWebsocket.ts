import {useEffect, useState, useRef} from 'react'

type ConnectionState = "connected" | "closed" | "failed" | "connecting"

function useWebsocket(uri: string): [ConnectionState, React.RefObject<WebSocket | null>]{
	let socket = useRef<WebSocket | null>(null);
	const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");

	useEffect(() => {
		socket.current = new WebSocket(`${import.meta.env.VITE_API_URL}${uri}`);

		socket.current.onopen = () => {
			setConnectionState("connected");
		}
		
		socket.current.onclose = () => {
			setConnectionState("closed");
		}
		
		socket.current.onerror = () => {
			setConnectionState("failed");
		}

		return (() => {
			if (socket.current?.readyState === WebSocket.OPEN){
				socket.current.close();
				setConnectionState("closed");
			}
		});
	}, [uri])

	return ([connectionState, socket]);
}

export default useWebsocket;