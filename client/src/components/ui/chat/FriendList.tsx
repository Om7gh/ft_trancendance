import { useMobile } from "@/hooks/useMobile";
import type { UserData } from "@/pages/Chat";

const Avatar = "https://i.pravatar.cc/300";

export default function FriendList({ data }: UserData[]) {
  const isMobile = useMobile();
  return (
    <div
      className={`${
        !isMobile ? `h-[80vh]` : "h-auto"
      } overflow-scroll bg-slate-900/40 p-3 rounded-xl shadow-sm shadow-slate-700/50`}>
      {!isMobile && (
        <div className="flex items-center gap-3 border-b border-b-slate-500 p-5">
          <img
            src={Avatar}
            alt="root"
            className=" w-25 border border-teal-500 p-1 h-auto rounded-full  object-cover "
          />
          <h3 className="text-2xl text-slate-400">omar</h3>
        </div>
      )}
      {!isMobile && (
        <p className="ml-6 text-lg text-slate-100 my-2">Messages</p>
      )}
      <ul
        className={`${
          isMobile && "flex justify-center items-center overflow-scroll"
        } p-5`}>
        {data &&
          data.map((data) => (
            <li
              key={data.id}
              className={`flex items-center justify-start gap-5 my-5 bg-slate-950/10 cursor-pointer hover:bg-slate-950/20 transition-all duration-150 rounded-xl p-2`}>
              <img
                src={Avatar}
                alt="avatar"
                className={`${
                  isMobile ? "w-15" : "w-20"
                } border border-teal-500 p-1 h-auto rounded-full object-cover ml-6`}
              />
              <div>
                {!isMobile && (
                  <>
                    <p className="text-lg text-slate-200">{data.username}</p>
                    <p className="text-[10px] text-teal-500">
                      {data.online ? "online" : "offline "}
                    </p>
                  </>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
