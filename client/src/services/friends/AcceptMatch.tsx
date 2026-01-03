import { useQuery } from "@tanstack/react-query"
import api from "../clientHttpService"

async function acceptMatch(id: string) {
    try {
        const {data} = await api.get(`/pongGame/remote/acceptInvitation?sid=${id}`);
        return data;
    } catch (e) {
        throw e
    }
}

export const useAcceptMatch = function  (id: string) {
    return useQuery({
        queryKey: ["accept-match"],
        queryFn: () => acceptMatch(id),
        enabled: false,
    })
}
