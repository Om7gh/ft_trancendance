import PendingRequest from "@/components/ui/friends/PendingRequest";
import SentRequests from "@/components/ui/friends/SentRequests";
import FriendsList from "@/components/ui/profile/FriendsList";
import { useGetFriends, useGetReceivedRequests, useGetSentRequests } from "@/services/friends";
import { useState } from "react";
import { FaUserFriends, FaUserClock, FaPaperPlane } from "react-icons/fa";

type FieldType = "friends" | "received" | "sent"

export default function Friends() {
  const [field, setField] = useState<FieldType>("friends")

  const {data: friends, isError, error, isPending} = useGetFriends()
  const {data: receivedRequests} = useGetReceivedRequests()
  const {data: sentRequests} = useGetSentRequests()

  console.log(friends, isError, error, isPending)

  const tabBaseClass =
    "group inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm sm:text-base transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50";

  const tabClass = (tab: FieldType) =>
    `${tabBaseClass} ${
      field === tab
        ? "bg-slate-950/60 text-white border border-violet-500/30"
        : "text-violet-200 hover:text-white hover:bg-slate-950/40"
    }`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="pb-6 flex items-center gap-4">
        <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <FaUserFriends className="w-8 h-8 text-violet-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent">
            Friends
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your friendships and requests
          </p>
        </div>
      </div>

      <div className="w-full bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex flex-wrap gap-2">
            <button 
              className={tabClass("friends")} 
              onClick={() => setField("friends")}
            >
              <FaUserFriends className="text-emerald-400" />
              <span>Friends</span>
              {friends && friends.length > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {friends.length}
                </span>
              )}
            </button>
            <button 
              className={tabClass("received")} 
              onClick={() => setField("received")}
            >
              <FaUserClock className="text-amber-400" />
              <span>Received</span>
              {receivedRequests && receivedRequests.length > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {receivedRequests.length}
                </span>
              )}
            </button>
            <button 
              className={tabClass("sent")} 
              onClick={() => setField("sent")}
            >
              <FaPaperPlane className="text-blue-400" />
              <span>Sent</span>
              {sentRequests && sentRequests.length > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {sentRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="p-5">
          {field === "friends" && <FriendsList friendsList={friends} />}
          {field === "received" && <PendingRequest />}
          {field === "sent" && <SentRequests />}
        </div>
      </div>
    </div>
  );
}
