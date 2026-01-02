import { useState, useEffect } from "react";
import { FaRankingStar } from "react-icons/fa6";

import api from "@/services/clientHttpService";
import MessageDisplayer from "@/pong/component/MessageDisplayer";
import { useNavigate } from "react-router-dom";

type PlayerType = {
    id: string;
    username: string;
    avatar: string;
    points?: number;
}

type PlayerPropsType = {
    player: PlayerType;
}

function Player({player}: PlayerPropsType) {
    return (
        <div className="flex items-center gap-3 md:p-3 p-2 bg-linear-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 transition-all rounded-xl flex-col">
            <img 
                src={player?.avatar || '/default-avatar.png'} 
                alt={player?.username} 
                className="w-8 h-8 md:w-16 md:h-16 rounded-full border-2 border-slate-500/50 object-cover"
            />
            <h4 className="text-violet-200 font-semibold text-xs md:text-lg">{player?.username}</h4>
        </div>
    )
}

type WaitingListPropsType = {
    memberList: Array<PlayerType>;
}

function WaitingList({memberList}: WaitingListPropsType) {
    if (memberList) {
        return (
            <div className="space-y-4 bg-slate-950/20 shadow-xl shadow-slate-800 p-4 rounded-xl">
                <h2 className="text-xl p-4 font-bold text-violet-200  text-center">
                    Waiting for Players <span className="text-violet-500">({memberList.length}/4)</span> 
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {
                        memberList.map((player) => {
                            return <Player key={player.id} player={player} />
                        })
                    }
                </div>
            </div>
        )
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
            return (
                <div className="p-8 bg-slate-950/20 border-4 border-dashed border-slate-600/50 flex items-center justify-center">
                    <p className="text-slate-400 text-sm">Waiting for players...</p>
                </div>
            )
        } else if ((match.state === "going") || (match.state === "done")) {
            const isLeftWinner = match.winner === match.leftPlayer?.id;
            const isRightWinner = match.winner === match.rightPlayer?.id;
            
            return (
                <div className="relative p-6 bg-linear-to-br from-slate-950/20 to-violet-800/50 border border-slate-600/40 shadow-xl">
                    {match.state === "done" && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-violet-500 text-violet-200 text-xs font-bold px-3 py-1 rounded-full">
                            FINISHED
                        </div>
                    )}
                    {match.state === "going" && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-violet-500 text-violet-200 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                            LIVE
                        </div>
                    )}
                    
                    <div className={`flex items-center gap-4 ${match.state === "done" ? "justify-center" : "justify-center"}`}>
                        <div className={`flex-1 ${isLeftWinner ? 'ring-2 ring-yellow-400' : ''}`}>
                            <Player player={match.leftPlayer} />
                            {match.leftPlayer?.points !== undefined && (
                                <p className="text-center text-2xl font-bold text-violet-200 mt-2">{match.leftPlayer.points}</p>
                            )}
                        </div>
                        
                        <div className="flex flex-col items-center px-4">
                            <span className="text-slate-400 font-bold text-sm">VS</span>
                        </div>
                        
                        <div className={`flex-1 ${isRightWinner ? 'ring-2 ring-yellow-400' : ''}`}>
                            <Player player={match.rightPlayer} />
                            {match.rightPlayer?.points !== undefined && (
                                <p className="text-center text-2xl font-bold text-violet-200 mt-2">{match.rightPlayer.points}</p>
                            )}
                        </div>
                    </div>
                </div>
            )
        }
    }
    return <MessageDisplayer message="Passed a null match" />
}

type ListMatchesPropsType = {
    matchList: Array<any>;
}

function ListMatches({matchList}: ListMatchesPropsType) {
    if (matchList) {
        return (
            <div className="flex flex-col md:flex-row justify-center gap-10 p-4 overflow-auto">
                {
                    matchList.map((match) => {
                        return <Match key={match.id} match={match} />
                    })
                }
            </div>
        )
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
            return <MessageDisplayer message="Preparing Round..." />;
        } else if ((round.state === "going") || (round.state === "done")) {
            return (
                <div className="space-y-4">
                    <ListMatches matchList={round.matches} />
                </div>
            )
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
        const getRoundLabel = (index: number, total: number) => {
            if (total === 1) return "Round 1st";
            if (index === 0) return "Round 1st";
            if (index === 1) return "Finals";
            return `Round ${index + 1}`;
        };

        return (
            <div className="space-y-8">
                {
                    roundList.map((round, index) => {
                        return (
                            <div key={round.id} className={`relative md:w-[50vmax] w-full `}>
                                <div className="flex items-center gap-3 mb-4 justify-center">
                                    <h3 className="text-md md:text-xl lg:text-xl font-bold text-violet-200">
                                        {getRoundLabel(index, roundList.length)}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        round.state === 'done' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
                                        round.state === 'going' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
                                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                    }`}>
                                        {round.state.toUpperCase()}
                                    </span>
                                </div>
                                <Round round={round} />
                                {index < roundList.length - 1 && (
                                    <div className="flex justify-center mt-6">
                                        <div className="w-0.5 h-8 bg-linear-to-b from-slate-800/50 to-transparent"></div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    return <MessageDisplayer message="Tournament round list is empty!!" />;
}

export default function PlayTournament() {
    const [data, setData] = useState<any>(null);
    const navigate = useNavigate()

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

        const intervalId = setInterval(() => loadTournament(), 1000)
        return (() => {
            ignored = true;
            clearInterval(intervalId);
        })
    }, [])

    async function leaveTournament () {
        try {
            await api.get("/pongGame/remote/tournament/leave");
            navigate("/dashboard/games/portal")
        } catch (e) {
             setData({
                    state: "error",
                    reason: "Failed to leave match!",
                });
        }
    }
    if (!data)
        return (
            <div className="h-full bg-slate-950/20 p-8 w-full">
                <div className="w-full mx-auto">
                    <MessageDisplayer message="Fetching Tournament..." />
                    <button 
                        onClick={leaveTournament}
                        className="mt-6 px-6 py-2 bg-pink-600/50 hover:bg-pink-700 text-violet-200 font-semibold transition-colors shadow-lg rounded-xl"
                    >
                        Leave Tournament
                    </button>
                </div>
            </div>
        )
    else if (data.state === "success") {
        if (data.tournament.state === "waiting") {
            return (
                <div className="h-full grid place-items-center w-full">
                    <div className="max-w-8xl mx-auto">
                        <div className="bg-slate-900/20 rounded-2xl p-8 border border-slate-900/20 shadow-xl shadow-slate-900">
                            <WaitingList memberList={data.tournament.members} />
                            <div className="flex flex-col justify-center mt-8">
                                <button 
                                    onClick={leaveTournament}
                                    className="px-8 py-3 bg-pink-600/50 hover:bg-pink-700 text-violet-200 font-semibold transition-all shadow-lg hover:shadow-pink-600/50 rounded-xl"
                                >
                                    Leave Tournament
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if ((data.tournament.state === "going") || (data.tournament.state === "done")) {
            return (
                <div className="h-full  w-full md:p-8 grid place-items-center">
                    <div className=" mx-auto">
                        <div className="bg-slate-950/20  p-2 md:p-8 border border-slate-700/50 shadow-2xl">
                            <div className="flex items-center md:justify-between justify-around mb-8 flex-col-reverse md:flex-row">
                                <h2 className="md:text-3xl font-bold bg-linear-to-l from-violet-500 to-neon bg-clip-text text-transparent">
                                    < FaRankingStar className="text-2xl md:text-5xl text-neon" />
                                    Tournament Stats</h2>
                                <span className={`self-end md:self-start md:px-4 md:py-2 px-2 py-1 text-xs md:text-xm font-bold shadow-xl shadow-slate-900 md:flex-col ${
                                    data.tournament.state === 'done' 
                                        ? 'bg-violet-500 text-violet-200' 
                                        : 'bg-violet-500 text-violet-200 animate-pulse'
                                }`}>
                                    {data.tournament.state === 'done' ? 'COMPLETED' : 'IN PROGRESS'}
                                </span>
                            </div>
                            <ListRounds roundList={data.tournament.rounds} />
                            <div className="flex justify-center mt-8 rounded-xl">
                                <button 
                                    onClick={leaveTournament}
                                    className="px-8 py-3 bg-pink-600/50 hover:bg-pink-700 text-violet-200 font-semibold transition-all shadow-lg hover:shadow-pink-600/50 rounded-xl"
                                >
                                    Leave Tournament
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else
            return (
                <div className="h-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 grid place-items-center">
                    <div className="max-w-6xl mx-auto">
                        <MessageDisplayer message="Tournament Canceled!!" />
                        <button 
                            onClick={leaveTournament}
                            className="mt-6 px-6 py-2 bg-pink-600/50 hover:bg-pink-700 text-violet-200 font-semibold transition-colors shadow-lg rounded-xl"
                        >
                            Leave Tournament
                        </button>
                    </div>
                </div>
            )
    }
    return <MessageDisplayer message={data.reason} />
}
