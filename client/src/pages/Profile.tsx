import { Avatar } from "@/assets";
import type { JSX } from "react";
import { IoSettings } from "react-icons/io5";
import { FiAward, FiActivity, FiBarChart2 } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Profile(): JSX.Element {
  const stats = {
    matches: {
      total: 24,
      wins: 18,
      losses: 6,
      winRate: 75,
    },
    tournaments: {
      total: 5,
      won: 2,
      runnerUp: 1,
      top3Rate: 60,
    },
    score: {
      total: 1250,
      rank: 42,
      progress: 68, // percentage to next rank
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 overflow-scroll max-h-screen">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-orange-500 leading-tight">
            Player Profile
          </h1>
          <div className="h-1.5 bg-gradient-to-r from-teal-500 via-teal-400 to-orange-500 w-full max-w-xs rounded-full mt-2" />
        </div>
        <Link
          to="/dashboard/settings"
          className="p-2 rounded-full hover:bg-slate-800/50 transition-all duration-200 group">
          <IoSettings className="text-2xl text-slate-400 group-hover:text-orange-500 transition-colors duration-200" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-slate-800 mb-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:border-r lg:border-slate-700 lg:pr-8">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-500/20 shadow-xl transition-all duration-300 group-hover:border-orange-500/40">
              <img
                src={Avatar}
                alt="avatar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-teal-400/20 pointer-events-none transition-all duration-300" />
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-slate-200 uppercase tracking-wider">
              Omar Ghazi
            </h2>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-500/20 border border-orange-500/30">
              <span className="h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse" />
              <span className="text-orange-400 font-medium">
                Beginner Player
              </span>
            </div>
            <p className="text-slate-400 mt-3 max-w-md">
              Competitive ping pong enthusiast with a passion for improving
              skills and climbing ranks.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-200 pb-2 border-b border-slate-700 flex items-center">
            <span className="bg-gradient-to-r from-teal-400 to-orange-500 bg-clip-text text-transparent">
              Player Information
            </span>
          </h3>
          <div className="space-y-4">
            <InfoRow label="Login" value="OmarGhazi" />
            <InfoRow label="Role" value="PingPong Player" />
            <InfoRow label="Email" value="omar@gmail.com" />
            <InfoRow label="Member Since" value="Jan 2023" />
            <InfoRow label="Play Style" value="Offensive" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<FiActivity className="text-2xl" />}
          title="Matches Played"
          value={stats.matches.total}
          description="Total competitive matches"
          stats={[
            {
              label: "Wins",
              value: stats.matches.wins,
              color: "text-teal-400",
            },
            {
              label: "Losses",
              value: stats.matches.losses,
              color: "text-rose-400",
            },
            {
              label: "Win Rate",
              value: `${stats.matches.winRate}%`,
              color: "text-amber-400",
            },
          ]}
          accent="bg-orange-500"
        />

        <StatCard
          icon={<FiAward className="text-2xl" />}
          title="Tournaments"
          value={stats.tournaments.total}
          description="Competitions entered"
          stats={[
            {
              label: "Won",
              value: stats.tournaments.won,
              color: "text-teal-400",
            },
            {
              label: "Runner-up",
              value: stats.tournaments.runnerUp,
              color: "text-amber-400",
            },
            {
              label: "Top 3 Rate",
              value: `${stats.tournaments.top3Rate}%`,
              color: "text-purple-400",
            },
          ]}
          accent="bg-teal-500"
        />

        <StatCard
          icon={<FiBarChart2 className="text-2xl" />}
          title="Total Score"
          value={stats.score.total.toLocaleString()}
          description="Points earned"
          stats={[
            {
              label: "Rank",
              value: `#${stats.score.rank}`,
              color: "text-teal-400",
            },
            {
              label: "Progress",
              value: `${stats.score.progress}%`,
              color: "text-blue-400",
            },
          ]}
          accent="bg-purple-500"
        />
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-slate-800">
        <h3 className="text-2xl font-bold text-slate-200 mb-6 pb-2 border-b border-slate-700 flex items-center">
          <span className="bg-gradient-to-r from-teal-400 to-orange-500 bg-clip-text text-transparent">
            Recent Activity
          </span>
        </h3>
        <div className="space-y-4">
          <ActivityItem
            event="Match Victory"
            opponent="AlexChen"
            score="3-1"
            date="2 hours ago"
            positive
          />
          <ActivityItem
            event="Tournament Progress"
            details="Advanced to Semi-Finals"
            tournament="Summer Cup"
            date="1 day ago"
            positive
          />
          <ActivityItem
            event="Match Defeat"
            opponent="SarahLee"
            score="2-3"
            date="3 days ago"
          />
          <ActivityItem
            event="Rank Improved"
            details="Moved from #48 to #42"
            date="1 week ago"
            positive
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-800 hover:border-slate-700 transition-colors">
      <p className="text-slate-400 font-medium">{label}:</p>
      <p className="text-slate-200 font-medium">{value}</p>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
  stats,
  accent,
}: {
  icon: JSX.Element;
  title: string;
  value: string | number;
  description: string;
  stats: Array<{ label: string; value: string | number; color: string }>;
  accent: string;
}) {
  return (
    <div className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div
        className={`w-12 h-12 ${accent} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-1">{title}</h3>
      <div className="text-4xl font-bold text-orange-500 mb-2">{value}</div>
      <p className="text-slate-400 mb-5">{description}</p>

      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-slate-400">{stat.label}:</span>
            <span className={`font-medium ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityItem({
  event,
  opponent,
  score,
  details,
  tournament,
  date,
  positive = false,
}: {
  event: string;
  opponent?: string;
  score?: string;
  details?: string;
  tournament?: string;
  date: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-start py-3 border-b border-slate-800 last:border-0 group">
      <div
        className={`w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0 ${
          positive ? "bg-teal-500" : "bg-rose-500"
        }`}
      />
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-slate-200">{event}</h4>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        {opponent && score && (
          <p className="text-slate-400 text-sm">
            vs <span className="text-slate-300">{opponent}</span> • Score:{" "}
            <span
              className={`font-medium ${
                positive ? "text-teal-400" : "text-rose-400"
              }`}>
              {score}
            </span>
          </p>
        )}
        {details && tournament && (
          <p className="text-slate-400 text-sm">
            {details} in <span className="text-slate-300">{tournament}</span>
          </p>
        )}
        {details && !tournament && (
          <p className="text-slate-400 text-sm">{details}</p>
        )}
      </div>
    </div>
  );
}
