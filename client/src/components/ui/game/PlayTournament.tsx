import { useEffect, useState } from 'react';
import type { TournamentPlayer } from '@/types/gameTypes';
import FirstRound from './FirstRound';
import DemiFinal from './DemiFinal';
import Final from './Final';
import api from '@/services/clientHttpService';
import Participant from './Participant';

function PlayTournament() {
  const [players, setPlayers] = useState<TournamentPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tournamentState, setTournamentState] = useState<'waiting' | 'going' | 'done'>('waiting');
  const [currentRound, setCurrentRound] = useState(1);

  useEffect(() => {
    let isMounted = true;
    async function fetchTournamentState() {
      try {
        const response = await api.get("/pongGame/remote/tournament/join");
        if (isMounted) {
          const res = response.data;
          console.log(res);
          if (res?.participants && Array.isArray(res.participants)) {
            const transformedPlayers: TournamentPlayer[] = res.participants.map((user: any) => ({
              avatar: user.avatar || 'https://avatar.iran.liara.run/public/33',
              username: user.username || user.first_name || 'Player',
              gameStatus: user.gameStatus || 'idle',
              round: res.round || 1, 
            }));

            const totalPlayers = 4;
            while (transformedPlayers.length < totalPlayers) {
              transformedPlayers.push({
                avatar: 'https://avatar.iran.liara.run/public/boy',
                username: 'Waiting...',
                gameStatus: 'waiting',
                round: res.round || 1,
              });
            }
            setPlayers(transformedPlayers);
          }
  
          if (res?.state) {
            setTournamentState(res.state);
          }
          
          if (res?.round?.length
          ) {
            setCurrentRound(res.round.length);
          } else {
            setCurrentRound(1);
          }
          
          setError("");
          setLoading(false);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || "Failed to fetch tournament data");
          setLoading(false);
        }
      }
    }
    
    fetchTournamentState();
    
    const intervalId = setInterval(() => {
      fetchTournamentState();
    }, 5000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-1/2">
        <p className="text-slate-100 text-lg">Loading tournament...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-1/2">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (Participant.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-1/2">
        <p className="text-slate-100 text-lg">Waiting for players to join...</p>
      </div>
    );
  }
  console.log(currentRound)
  return (
    <div className="flex items-center justify-center w-full h-1/2 overflow-auto">
      <div className="grid grid-cols-1 grid-rows-3 place-items-center overflow-auto gap-10">
        {tournamentState === 'waiting' && (
          <div className="text-center">
            <p className="text-slate-100 text-lg mb-4">
              Waiting for all players ({players.filter(p => p.gameStatus !== 'waiting').length}/4)
            </p>
            <FirstRound players={players} />
          </div>
        )}
        {tournamentState === 'going' && (
          <>
            {currentRound >= 1 && <FirstRound players={players} />}
            {currentRound >= 2 && <DemiFinal players={players} />}
            {currentRound >= 3 && <Final players={players} />}
          </>
        )}
        {tournamentState === 'done' && (
          <>
            <FirstRound players={players} />
            <DemiFinal players={players} />
            <Final players={players} />
          </>
        )}
      </div>
    </div>
  );
}

export default PlayTournament;
