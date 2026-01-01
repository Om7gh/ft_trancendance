import { useEffect } from "react";

function useWsResponse(socket: React.RefObject<WebSocket | null>, handler: (msg: any) => void, dep: any = null) {
    useEffect(() => {
        function wrapper(event: MessageEvent) {
			try{
				const incomingMsg = JSON.parse(event.data);
				handler(incomingMsg);
			}
			catch (error){
				console.error("failed to parse incoming message: ", error);
				console.log("THe error content: ", error);
			}
		}
		socket.current?.addEventListener("message", wrapper);
		return (() => {
			socket.current?.removeEventListener("message", wrapper);
		});
    }, [dep]);
}

export default useWsResponse;