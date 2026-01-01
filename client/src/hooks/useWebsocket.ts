import {useEffect, useRef} from 'react'

function useWebsocket(uri: string){
	let socket = useRef<WebSocket | null>(null);

	useEffect(() => {
		socket.current = new WebSocket(`${import.meta.env.VITE_API_URL}${uri}`);

		socket.current.onclose = () => {
			console.log("socket connection closed")
		}
		
		socket.current.onerror = () => {
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