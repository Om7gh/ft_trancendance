import { useGetReceivedRequests, useApproveFriendRequest, useRejectFriendRequest } from "@/services/friends";
import type { Friend } from "@/types/friendTypes";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { useState } from "react";

function PendingRequest() {
  const { data: requests, isLoading, error } = useGetReceivedRequests();
  const approve = useApproveFriendRequest();
  const reject = useRejectFriendRequest();
  const [processingUid, setProcessingUid] = useState<string | null>(null);

  const handleApprove = async (uid: string) => {
    setProcessingUid(uid);
    approve.mutate(uid, {
      onSettled: () => setProcessingUid(null),
    });
  };

  const handleReject = async (uid: string) => {
    setProcessingUid(uid);
    reject.mutate(uid, {
      onSettled: () => setProcessingUid(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <BiLoaderAlt className="text-violet-500 text-4xl animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-rose-400">
        Failed to load pending requests. Please try again.
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No pending friend requests.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request: Friend) => (
        <div
          key={request.uid}
          className="flex items-center gap-4 p-4 bg-slate-900/30 hover:bg-slate-900/50 border border-orange-500/20 rounded-lg transition-all duration-200"
        >
          <img
            src={request.avatar ?? "/default-avatar.png"}
            alt={request.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/30"
          />
          <div className="flex-1 min-w-0">
            <div className="text-slate-100 font-medium truncate">
              {request.username}
            </div>
            <div className="text-sm text-slate-400 truncate">
              {request.fullname}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(request.uid)}
              disabled={processingUid === request.uid}
              className="p-2 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-lg transition-colors disabled:opacity-50"
              title="Accept"
            >
              {processingUid === request.uid && approve.isPending ? (
                <BiLoaderAlt className="text-xl animate-spin" />
              ) : (
                <FaUserCheck className="text-xl" />
              )}
            </button>
            <button
              onClick={() => handleReject(request.uid)}
              disabled={processingUid === request.uid}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
              title="Reject"
            >
              {processingUid === request.uid && reject.isPending ? (
                <BiLoaderAlt className="text-xl animate-spin" />
              ) : (
                <FaUserTimes className="text-xl" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PendingRequest;