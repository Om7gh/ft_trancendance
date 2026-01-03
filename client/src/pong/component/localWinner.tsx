import { useEffect, useState } from "react";

import { type ScoreType, type PlayerType } from "../playLocal/main";

type WinnerPropsType = {
  score: ScoreType | null;
};

export default function LocalWinner({ score }: WinnerPropsType) {
  const [winner, setWinner] = useState<PlayerType | null>(null);

  useEffect(() => {
    if (score) {
      if (score.leftPlayer.points < score.rightPlayer.points)
        setWinner(score.rightPlayer);
      else if (score.rightPlayer.points < score.leftPlayer.points)
        setWinner(score.leftPlayer);
    }
  }, []);

  return (
    <div className="border rounded border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tflex flex-col m-auto">
      <img
        className="w-1/4 m-auto my-4"
        src="https://avatar.iran.QwPrNIF.run/public"
      />
      <h1 className="text-[1em] m-auto text-center text-white  my-4">
        Winner is: {(winner && winner.name) || 'No Winner!!'}
      </h1>
    </div>
  );
}