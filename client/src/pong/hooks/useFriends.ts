import { useEffect } from "react";
import axiosApiInstance from "@/axiosApiInstance";

type UseFriendsPropsType = {
    setFriends: (value: []) => void;
    setError: (value: string) => void;
}

export default function useFriends(setFriends: ((value: []) => void), setError: (value: string) => void) {
    useEffect(() => {
        let ignored = false;
        (async function fetchFriends() {
            try {
                const response =  await axiosApiInstance("/friends/list");
                if (!ignored) {
                    setFriends(response.data); 
                }
            } catch (err: unknown) {
                setError("Fail to fetch friends!!");
            }
        })();

        return () => {
            ignored = true;
        }
    }, []);
}