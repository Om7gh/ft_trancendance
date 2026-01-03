import { useEffect } from "react";
import { validateMatch } from "../utils/utils.ts";
import type { MatchType } from "../types/playWithSomeOne.ts";
import api from "@/services/clientHttpService.ts";


export default function useFetchMatch(
    url: string,
    setMatch: ((match: MatchType) => void),
    setError: ((error: string | null) => void)
) {
    useEffect(() => {
        let ignored = false;

        setError(null);
        (async function fetchMatch() {
            try {
                const response = await api.get(url);
                if (!ignored) {
                    if (validateMatch(response.data))
                        setMatch(response.data);
                    else
                        setError("Fetch Invalid Match");
                }
            } catch (err: any) {
                setError("Fail To Fetch Match!!");
            }
        })();

        return (() => {
            ignored = true;
        })
    }, [url]);
}