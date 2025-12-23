import type { User } from "@/App";

function ResultBadge({ win }: { win: boolean }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-medium tracking-wide border shadow-xl ${
        win
          ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
          : 'bg-pink-500/15 text-pink-300 border-pink-500/30'
      }`}
    >
      {win ? 'VICTORY' : 'DEFEAT'}
    </span>
  );
}

function PongHistory({user}: {user: User}) {
  return (
    <div>PongHistory</div>
  )
}

export default PongHistory