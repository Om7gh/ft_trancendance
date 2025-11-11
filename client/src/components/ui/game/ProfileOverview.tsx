import Button from "../utils/Button";


interface ProfileDataType {
  username: string;
  avatar: string;
  id: number;
}

export default function ProfileOverview({ data }: { data: ProfileDataType[] }) {
  if (!data.length)
    return (
      <div className="p-6 text-center bg-slate-800/50 rounded-xl border border-slate-700">
        <p className="text-slate-400">Select a player to view profile</p>
      </div>
    );

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-teal-500/10">
      <div className="bg-gradient-to-r from-teal-900/30 to-slate-900 p-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={data[0].avatar}
              alt="avatar"
              className="w-32 h-32 object-cover rounded-full border-4 border-slate-800 shadow-lg relative z-10"
            />
            <div className="absolute inset-0 bg-teal-500 rounded-full blur-md opacity-20 animate-pulse"></div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{data[0].username}</h2>
            <span className="inline-block mt-1 px-3 py-1 text-xs bg-slate-800 text-teal-400 rounded-full">
              Pro Player
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 bg-slate-800/30">
        <div className="bg-slate-800/60 rounded-lg p-3 text-center transition-transform hover:scale-105">
          <p className="text-xs uppercase tracking-wider text-teal-400">Wins</p>
          <p className="text-2xl font-bold text-white">56%</p>
          <div className="h-1 mt-2 bg-teal-500/30 rounded-full">
            <div
              className="h-1 bg-teal-500 rounded-full"
              style={{ width: "56%" }}></div>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-lg p-3 text-center transition-transform hover:scale-105">
          <p className="text-xs uppercase tracking-wider text-rose-400">
            Losses
          </p>
          <p className="text-2xl font-bold text-white">43%</p>
          <div className="h-1 mt-2 bg-rose-500/30 rounded-full">
            <div
              className="h-1 bg-rose-500 rounded-full"
              style={{ width: "43%" }}></div>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-lg p-3 text-center transition-transform hover:scale-105">
          <p className="text-xs uppercase tracking-wider text-amber-400">
            Draws
          </p>
          <p className="text-2xl font-bold text-white">1%</p>
          <div className="h-1 mt-2 bg-amber-500/30 rounded-full">
            <div
              className="h-1 bg-amber-500 rounded-full"
              style={{ width: "1%" }}></div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Matches Played</span>
          <span className="text-white">127</span>
        </div>
        <div className="flex justify-between text-sm text-slate-400">
          <span>Win Streak</span>
          <span className="text-white">8</span>
        </div>
      </div>

      <div className="p-4 flex gap-3 bg-slate-900/50">
        <Button
          type="signIn"
          className="flex-1 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white shadow-lg shadow-teal-500/20">
          Challenge
        </Button>
        <Button
          type="signUp"
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
          View Profile
        </Button>
      </div>
    </div>
  );
}
