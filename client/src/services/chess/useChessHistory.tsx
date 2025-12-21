import axiosApiInstance from "@/axiosApiInstance"
import { useQuery } from "@tanstack/react-query"

async function getChessHistory(username: string) {
    try {
        const response = await axiosApiInstance.get(`/game/chess/history?username=${username}`)
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