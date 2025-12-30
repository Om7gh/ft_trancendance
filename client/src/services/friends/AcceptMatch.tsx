import { useQuery } from "@tanstack/react-query"
import api from "../clientHttpService"

async function acceptMatch() {
    try {
        const {data} = await api.get("/pongGame/remote/inviteFriend");
        return data;
    } catch (e) {
        throw e
    }
}

export const useAcceptMatch = function  () {
    return useQuery({
        queryKey: ["accept-match"],
        queryFn: acceptMatch
    })
}
