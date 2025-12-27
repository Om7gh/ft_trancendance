import { useState, useEffect } from "react";

import api from "@/services/clientHttpService";
import MessageDisplayer from "../component/MessageDisplayer";

type PlayerType = {
    id: string;
    username: string;
    avatar: string;
}

type PlayerPropsType = {
    player: PlayerType;
}

function Player({player}: PlayerPropsType) {
    return (
        <div>
            <img src={player.avatar} alt="useImage" />
            <h2>{player.username}</h2>
        </div>
    )
}

type WaitingListPropsType = {
    memberList: Array<PlayerType>;
}

function WaitingList({memberList}: WaitingListPropsType) {
    if (memberList) {
        return (<div>
            {
                memberList.map((player) => {
                    return <Player key={player.id} player={player} />
                })
            }
        </div>)
    }
    return <MessageDisplayer message="Tournament member list is empty!!" />;
}

type MatchType = {
    id: string;
    state: string;
    leftPlayer: PlayerType;
    rightPlayer: PlayerType;
    winner: string;
}

type MatchPropsType = {
    match: MatchType;
}

function Match({match}: MatchPropsType) {
    if (match) {
        if (match.state === "waiting") {
            return <MessageDisplayer message="Wainting for players..." />
        } else if ((match.state === "going") || (match.state === "done")) {
            return (<div>
                <Player player={match.leftPlayer} />
                <p>Vs</p>
                <Player player={match.rightPlayer} />
            </div>)
        }
    }
    return <MessageDisplayer message="Passed a null round" />
}

type ListMatchesPropsType = {
    matchList: Array<any>;
}

function ListMatches({matchList}: ListMatchesPropsType) {
    if (matchList) {
        return (<div>
            {
                matchList.map((match) => {
                    return <Match key={match.id} match={match} />
                })
            }
        </div>)
    }
    return <MessageDisplayer message="Pass an empty matchList!!" />;
}

type RoundType = {
    id: string;
    state: string;
    matches: Array<any>;
}

type RoundPropsType = {
    round: RoundType;
}

function Round({round}: RoundPropsType) {
    if (round) {
        if (round.state === "waiting") {
            return <MessageDisplayer message="Prapering Round..." />;
        } else if ((round.state === "going") || (round.state === "done")) {
            return <ListMatches matchList={round.matches} />
        } else
            return <MessageDisplayer message="Round canceled!!" />;
    }
    return <MessageDisplayer message="Passed a null round" />
}

type ListRoundsPropsType = {
    roundList: Array<any>;
}

function ListRounds({roundList}: ListRoundsPropsType) {
    if (roundList) {
        return (<div>
            {
                roundList.map((round) => {
                    return <Round key={round.id} round={round} />
                })
            }
        </div>)
    }
    return <MessageDisplayer message="Tournament round list is empty!!" />;
}

export default function Tournament() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        let ignored = false;
        (async function fetchFriends() {
            try {
                const response =  await api("/friends");
                if (!ignored) {
                    setData({
                        state: "success",
                        tournament: response.data
                    });
                }
            } catch (err: unknown) {
                setData({
                    state: "error",
                    reason: "Failed to fetch tournament!!",
                });
            }
        })();
        return (() => {
            ignored = true;
        })
    }, [])

    if (!data)
        return <MessageDisplayer message="Fetching Tournament..." />
    else if (data.state === "success") {
        if (data.tournament.state === "waiting") {
            return (<WaitingList memberList={data.tournament.participants} />)
        } else if ((data.tournament.state === "going") || (data.tournament.state === "done")) {
            return <ListRounds roundList={data.tournament.rounds} />
        } else
            return <MessageDisplayer message="Tournament Canceled!!" />
    }
    return <MessageDisplayer message={data.reason} />
}