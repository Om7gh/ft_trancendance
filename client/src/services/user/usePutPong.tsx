import { useMutation } from "@tanstack/react-query";
import api from "../clientHttpService";
import type { CustomizationType } from "@/pong/types/playMatch";


async function putPong(payload : CustomizationType) {
    try {
        const {data} = await api.put("/pongGame/remote/pongCustomization/update", {
            data: payload
        })
        return data;
    }catch(e) {
        throw e
    }
}

export function usePutPong() {
    return useMutation({
        mutationKey: ["putPong"],
        mutationFn: putPong
    })
}
