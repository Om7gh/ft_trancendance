import { useUnfriend } from "@/services/friends";
import type { Friend } from "@/types/friendTypes";
import { FaUserMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

interface FriendsListProps {
  friendsList: Friend[];
}

function FriendsList({ friendsList }: FriendsListProps) {
  const unfriend = useUnfriend();

  const handleUnfriend = (uid: string, username: string) => {
    if (confirm(`Remove ${username} from your friends?`)) {
      unfriend.mutate(uid);
    }
  };

    const getFriendshipTime = (friend: any) => {
        if (!friend?.friends_since) return 'unknown period';

        const now = Date.now();
        const lastLogin = friend.friends_since * 1000;
        const diffMs = now - lastLogin;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffSeconds < 60) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
        return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
    };

  if (!friendsList || friendsList.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No friends yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friendsList?.map((friend: Friend) => (
        <Link to={`/dashboard/profile/${friend.username}`}
          key={friend?.id}
          className="flex items-center gap-4 p-4 bg-slate-900/30 hover:bg-slate-900/50 border border-violet-500/10 rounded-lg transition-all duration-200"
        >
          <img
            src={friend?.avatar}
            alt={friend?.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-violet-500/30"
          />
          <div className="flex-1 min-w-0">
            <div className="text-slate-100 font-medium truncate">
              {friend?.username}
            </div>
            <div className="text-sm text-slate-400 truncate">
              {friend?.fullname}
            </div>
            {friend.friends_since && (
              <div className="text-xs text-slate-500">
                Friends since {getFriendshipTime(friend)}
              </div>
            )}
          </div>
          <button
            onClick={() => handleUnfriend(friend.id, friend.username)}
            disabled={unfriend.isPending}
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
            title="Unfriend"
          >
            <FaUserMinus className="text-xl" />
          </button>
        </Link>
      ))}
    </div>
  );
}

export default FriendsList;
