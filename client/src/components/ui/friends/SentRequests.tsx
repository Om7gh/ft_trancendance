import { useGetSentRequests, useCancelFriendRequest } from "@/services/friends";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";

function SentRequests() {
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const { data: sentRequests } = useGetSentRequests();
  const cancelRequest = useCancelFriendRequest();

  const handleCancelRequest = (uid: string, username: string) => {
    if (confirm(`Cancel friend request to ${username}?`)) {
      setCancelingId(uid);
      cancelRequest.mutate(uid, {
        onSettled: () => setCancelingId(null),
      });
    }
  };

  if (!sentRequests || sentRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <FaPaperPlane className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg mb-2">No pending requests</p>
        <p className="text-slate-500 text-sm">You haven't sent any friend requests yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sentRequests.map((request: any) => (
        <div
          key={request.id}
          className="flex items-center gap-4 p-4 bg-slate-900/30 border border-slate-700/50 rounded-lg group hover:bg-slate-900/50 transition-colors"
        >
          <Link 
            to={`/dashboard/profile/${request.username}`}
            className="flex items-center gap-4 flex-1 min-w-0"
          >
            <img
              src={request.avatar}
              alt={request.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
            />
            <div className="flex-1 min-w-0">
              <div className="text-slate-100 font-medium truncate">
                {request.username}
              </div>
              <div className="text-sm text-slate-400 truncate">
                {request.fullname}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs text-blue-400">Request pending</span>
              </div>
            </div>
          </Link>
          <button
            onClick={() => handleCancelRequest(request.id, request.username)}
            disabled={cancelingId === request.id}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cancel request"
          >
            {cancelingId === request.id ? (
              <BiLoaderAlt className="text-xl animate-spin" />
            ) : (
              <IoClose className="text-2xl" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

export default SentRequests;
