import { useUnfriend } from "@/services/friends";
import type { Friend } from "@/types/friendTypes";
import { FaUserMinus } from "react-icons/fa";

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

  console.log(friendsList)

  if (!friendsList || friendsList.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No friends yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friendsList.map((friend: Friend) => (
        <div
          key={friend.uid}
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
                Friends since {new Date(friend.friends_since * 1000).toLocaleDateString()}
              </div>
            )}
          </div>
          <button
            onClick={() => handleUnfriend(friend.uid, friend.username)}
            disabled={unfriend.isPending}
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
            title="Unfriend"
          >
            <FaUserMinus className="text-xl" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default FriendsList;
