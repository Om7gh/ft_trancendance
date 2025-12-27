import { useState, useEffect } from "react";

import api from "@/services/clientHttpService";
import MessageDisplayer from "@/pong/component/MessageDisplayer";

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

export default function PlayTournament() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        let ignored = false;
        async function loadTournament() {
            try {
                const response =  await api("/pongGame/remote/tournament/join");
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
        };

        loadTournament();

        const intervalId = setInterval(() => loadTournament(), [5000])
        return (() => {
            ignored = true;
            clearInterval(intervalId);
        })
    }, [])

    console.log(data)


    async function leaveTournament () {
        try {
            await api.get("/pongGame/remote/tournament/leave");
            console.log("success")
        } catch (e) {
            console.log(e);
        }
    } 

    if (!data)
        return <div>
             <MessageDisplayer message="Fetching Tournament..." />
             <button onClick={leaveTournament}>leave</button>
            </div>
    else if (data.state === "success") {
        if (data.tournament.state === "waiting") {
            return <div>
                (<WaitingList memberList={data.tournament.participants} />)
             <button onClick={leaveTournament}>leave</button>
            </div> 
        } else if ((data.tournament.state === "going") || (data.tournament.state === "done")) {
            return <div>
                <ListRounds roundList={data.tournament.rounds} />
                <button onClick={leaveTournament}>leave</button>
            </div> 
        } else
            return <div>
                <MessageDisplayer message="Tournament Canceled!!" />
             <button onClick={leaveTournament}>leave</button>

            </div> 
    }
    return <MessageDisplayer message={data.reason} />
}