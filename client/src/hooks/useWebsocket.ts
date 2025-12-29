import {useEffect, useRef} from 'react'

function useWebsocket(uri: string){
	let socket = useRef<WebSocket | null>(null);

	useEffect(() => {
		socket.current = new WebSocket(`ws://localhost:8080${uri}`);

		socket.current.onclose = (event) => {
			console.log("socket connection closed")
		}
		
		socket.current.onerror = (event) => {
			console.log("socket connection have an error");
		}
		return (() => {
			if (socket.current?.readyState === WebSocket.OPEN)
				socket.current.close();
			console.log("connection is closed!");
		});
	}, [uri])

	return (socket);
}

export default useWebsocket;