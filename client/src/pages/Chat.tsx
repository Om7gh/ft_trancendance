import { AllFriends, FriendList, Message } from "@/components/ui";
import { useMobile } from "@/hooks/useMobile";
import { useState } from "react";

export interface UserData {
  id: number;
  username: string;
  online: boolean;
}

const userData = [
  { id: 1, username: "omar", online: true },
  { id: 3, username: "ilyass", online: true },
  { id: 2, username: "mustafa", online: true },
  { id: 4, username: "ayoub", online: true },
];

export default function chat() {
  const isMobile = useMobile();
  const [data] = useState<UserData[]>(userData);
  return (
    <div className="w-3/4  m-auto h-full">
      <div
        className={`grid ${
          !isMobile ? "grid-cols-[auto_1fr_auto]" : "grid-cols-1"
        } w-full h-full p-3 gap-3 `}>
        <FriendList data={data} />
        <Message />
        <AllFriends />
      </div>
    </div>
  );
}
