import { useEffect, useState } from "react";
import type { ServerRequest } from "@/types/serverRequest.ts";

function useWsRequest(connection: WebSocket | null) 
	: React.Dispatch<React.SetStateAction<ServerRequest | null>> {
	const [request, setRequest] = useState<ServerRequest | null>(null);

	useEffect(() => {
		if (connection && request && connection.readyState === WebSocket.OPEN){
			connection.send(JSON.stringify(request));
		}
	}, [connection, request]);

	return setRequest;
}

export default useWsRequest;