import { useQuery } from "@tanstack/react-query"
import api from "../clientHttpService";

async function getPongState() {
    try {
        const response = await api.get(`/pongGame/statistics`)
        console.log("data here ...",response.data)
        return response.data;
    } catch (e) {
        throw e;
    }
}

const useGetPongStat = () => {
  return useQuery({
    queryKey: ["pongStats"],
    queryFn: getPongState,
  });
};


export default useGetPongStat