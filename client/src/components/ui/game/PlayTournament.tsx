import { useEffect, useState } from 'react';
import type { TournamentPlayer } from '@/types/gameTypes';
import FirstRound from './FirstRound';
import DemiFinal from './DemiFinal';
import Final from './Final';
import api from '@/services/clientHttpService';

const mockPlayers = [
  {
    avatar: 'https://avatar.iran.liara.run/public/33',
    username: 'omar',
    gameStatus: 'idle', // 'idle' ´win´ ´lose´
    round: 3,
  },
  {
    avatar: 'https://avatar.iran.liara.run/public/34',
    username: 'karim',
    gameStatus: 'idle',
    round: 1,
  },
  {
    avatar: 'https://avatar.iran.liara.run/public/35',
    username: 'adil',
    gameStatus: 'idle',
    round: 1,
  },
  {
    avatar: 'https://avatar.iran.liara.run/public/36',
    username: 'ibrahim',
    gameStatus: 'idle',
    round: 1,
  },
];

function PlayTournament() {
  const [players, setPlayers] = useState<TournamentPlayer[]>(mockPlayers);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchTournamentState() {
      try {
        const response = await api.get("/pongGame/remote/tournament");
        if (isMounted) {
          setData(response.data);
          setError("");
          setLoading(false);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || "Failed to fetch notifications");
          setLoading(false);
        }
      }
    }
    fetchTournamentState();
    // const intervalId = setInterval(() => {
    //   fetchTournamentState();
    // }, 10000);
    // return () => {
    //   isMounted = false;
    //   clearInterval(intervalId);
    // };
  }, [])
  
  console.log("users : ",data?.users)
  console.log("id", data?.id)
  console.log(data?.state)

  return (
    <div className="flex items-center justify-center w-full h-1/2 overflow-auto">
      <div className="grid grid-cols-1 grid-rows-3 place-items-center  overflow-auto gap-10">
        {players[0].round >= 1 && <FirstRound players={players} />}
        {players[0].round >= 2 && <DemiFinal players={players} />}
        {players[0].round >= 3 && <Final players={players} />}
      </div>
    </div>
  );
}

export default PlayTournament;
