import { useEffect, useRef, useState } from "react"
import axiosApiInstance from '@/axiosApiInstance';

function useAxios(uri: string | null): [React.RefObject<any>, string]{
	const  [fetchStatus, setFetchStatus] = useState("loading");
	const resource = useRef<any>([]);

	useEffect(() => {
		const cancelController = new AbortController();
		async function fetchData(){
			let response;
			try{
				response = await axiosApiInstance.get(`http://localhost:8080${uri}`, {
					signal: cancelController.signal
				});
				resource.current = response.data;
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
			cancelController.abort();
		}

	}, [uri]);

	return ([resource, fetchStatus]);
}

export default useAxios;