import { useEffect } from "react";
import { validateMatch } from "../utils/utils.ts";
import type { MatchType } from "../types/playWithSomeOne.ts";
import api from "@/services/clientHttpService.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function useFetchMatch(
    url: string,
    setMatch: ((match: MatchType) => void),
    setError: ((error: string) => void)
) {
    const navigate = useNavigate()
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
                // setError(err.message || 'Fail to fetch match!!');
                toast.error(err.message || 'Fail to fetch match!!')
                navigate(-1)
            }
        })();

        return (() => {
            ignored = true;
        })
    }, [url]);
}