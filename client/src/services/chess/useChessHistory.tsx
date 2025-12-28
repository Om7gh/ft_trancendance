import { useQuery } from "@tanstack/react-query"
import api from "../clientHttpService";

async function getChessHistory(username: string) {
    try {
        const response = await api.get(`/game/chess/history?username=${username}`)
        console.log(response.data)
        return response.data;
    } catch (e) {
        throw e;
    }
}

const useGetChessHistory = (username: string) => {
  return useQuery({
    queryKey: ["chessHistory", username],
    queryFn: () => getChessHistory(username),
    enabled: !!username,
  });
};


export default useGetChessHistory