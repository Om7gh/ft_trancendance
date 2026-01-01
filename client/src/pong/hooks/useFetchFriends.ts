import { useEffect } from "react";
import api from "@/services/clientHttpService";

export default function useFetchFriends(setFriends: ((value: []) => void), setError: (value: string) => void) {
    useEffect(() => {
        let ignored = false;
        (async function fetchFriends() {
            try {
                const response =  await api("/friends");
                if (!ignored) {
                    setFriends(response.data);
                }
            } catch (err: any) {
                setError(err?.message ?? "Fail to fetch friends!!");
            }
        })();

        return () => {
            ignored = true;
        }
    }, []);
}
