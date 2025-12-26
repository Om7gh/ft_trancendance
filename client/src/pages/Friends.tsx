import BlockedFriends from "@/components/ui/friends/BlockedFriends";
import PendingRequest from "@/components/ui/friends/PendingRequest";
import FriendsList from "@/components/ui/profile/FriendsList";
import { useGetFriends } from "@/services/friends";
import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";

type FieldType = "friend" | "pending" | "blocked"

export default function Friends() {
  const [field, setField] = useState<FieldType>("friend")

  const {data, isError, error, isPending} = useGetFriends()

  console.log(data)

  const tabBaseClass =
    "group inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm sm:text-base transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50";

  const tabClass = (tab: FieldType) =>
    `${tabBaseClass} ${
      field === tab
        ? "bg-slate-950/60 text-white border border-violet-500/30"
        : "text-violet-200 hover:text-white hover:bg-slate-950/40"
    }`;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="pb-6 text-2xl bg-linear-30 from-violet-500 to-neon bg-clip-text text-transparent w-fit flex gap-4 items-center">
        <FaUserFriends className="w-10 h-10 text-violet-500" />
        <p className="text-3xl">Friends</p>
      </div>

      <div className="w-full bg-violet-900/20 rounded-lg border border-violet-500/20 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-violet-500/10">
          <div className="flex flex-wrap gap-2">
            <button className={tabClass("friend")} onClick={() => setField("friend")}>
              <FaUserFriends className="text-teal-500" />
              Friends
            </button>
            <button className={tabClass("pending")} onClick={() => setField("pending")}>
              <FaUserFriends className="text-orange-500" />
              Pending
            </button>
            <button className={tabClass("blocked")} onClick={() => setField("blocked")}>
              <FaUserFriends className="text-pink-500" />
              Blocked
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-5">
          {field === "friend" && <FriendsList friendsList={data} />}
          {field === "pending" && <PendingRequest />}
          {field === "blocked" && <BlockedFriends />}
        </div>
      </div>
    </div>
  );
}
