import { useEffect } from "react";
import { validateMatch } from "../utils/utils.ts";
import axiosApiInstance from "@/axiosApiInstance.ts";
import type { MatchType } from "../types/playWithSomeOne.ts";


export default function useFetchMatch(
    url: string,
    setMatch: ((match: MatchType) => void),
    setError: ((error: string) => void)
) {

    useEffect(() => {
        let ignored = false;

        (async function fetchMatch() {
            try {
                const response = await axiosApiInstance.get(url);
                if (!ignored) {
                    if (validateMatch(response.data))
                        setMatch(response.data);
                    else
                        setError("Error: fetch invalid match");
                }
            } catch (err) {
                setError('Fail to fetch match!!');
            }
        })();

        return (() => {
            ignored = true;
        })
    }, []);
}