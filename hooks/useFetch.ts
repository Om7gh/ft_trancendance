import { useEffect, useRef, useState } from "react"

function useFetch(uri: string | null): [React.RefObject<any>, string]{
	let [fetchStatus, setFetchStatus] = useState("loading");
	let resource = useRef([]);

	useEffect(() => {
		async function fetchData(){
			let response = await fetch(`http://localhost:8080${uri}`);
			if (!response.ok)
				throw new Error(`Failed to load: ${uri}`);
			let data = await response.json();
			return (data);
		}

		function test(){
			fetchData()
			.then((data) => {
				resource.current = data;
				setFetchStatus("fulfilled");
			})
			.catch(() => setFetchStatus("error"));
		}
		if (!uri){
			setFetchStatus("fulfilled");
		}
		else
			setTimeout(test, 500);
	}, [uri]);

	return ([resource, fetchStatus]);
}

export default useFetch;