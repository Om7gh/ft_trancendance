import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type MatchType } from "../types/playWithSomeOne.ts";

import useFetchMatch from "../hooks/useFetchMatch.ts";
import MessageDisplayer from "../component/MessageDisplayer.tsx";
import PlayMatch from "./playMatch.tsx";

export default function JoinMatch() {
    const [error, setError] = useState<string | null>(null);
    const [match, setMatch] = useState<MatchType | null>(null);
    const [searchParams]    = useSearchParams();
    const matchId           = searchParams.get("rid");

    useFetchMatch(`/pongGame/remote/joinMatch?rid=${matchId}`, setMatch, setError);
    
    if (error)
    return <MessageDisplayer message={error} />;
    else if (match)
    return <PlayMatch match={match} />;

    return <MessageDisplayer message={'Fetching Match...'} />;
}
