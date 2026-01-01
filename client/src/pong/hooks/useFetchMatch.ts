import { useEffect } from "react";
import { validateMatch } from "../utils/utils.ts";
import type { MatchType } from "../types/playWithSomeOne.ts";
import api from "@/services/clientHttpService.ts";


export default function useFetchMatch(
    url: string,
    setMatch: ((match: MatchType) => void),
    setError: ((error: string) => void)
) {
    useEffect(() => {
        let ignored = false;

        (async function fetchMatch() {
            try {
                const response = await api.get(url);
                console.log(response.data)
                if (!ignored) {
                    if (validateMatch(response.data))
                        setMatch(response.data);
                    else
                        setError("Error: fetch invalid match");
                }
            } catch (err: any) {
                setError(err?.message || "Fail to fetch match!!");
            }
        })();

        return (() => {
            ignored = true;
        })
    }, [url]);
}