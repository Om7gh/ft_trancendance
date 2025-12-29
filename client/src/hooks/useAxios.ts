import { useEffect, useRef, useState } from "react"
import api from "@/services/clientHttpService";

function useAxios(uri: string | null): [any, React.Dispatch<any>, string]{
	const [fetchStatus, setFetchStatus] = useState("loading");
	const [resource, setResource] = useState<any>([]);

	useEffect(() => {
		async function fetchData(){
			let response;
			try{
				response = await api.get(`${uri}`);
				setResource(response.data);
				setFetchStatus("fulfilled");
			}
			catch (err){
				console.log("failed to load:", err);
				setFetchStatus("error");
			}
		}

		function test(){
			fetchData();
		}

		if (!uri){
			setFetchStatus("fulfilled");
		}
		else
			setTimeout(test, 500);

		return () => {
		}

	}, [uri]);

	return ([resource, setResource, fetchStatus]);
}

export default useAxios;