import { GlobalContext } from '@/App';
import { useSendFriendRequest } from '@/services/friends';
import { useContext } from 'react';

function ProfileHeader() {
  const { user } = useContext(GlobalContext);
  const mutateFriend = useSendFriendRequest()

  const sendRequest = () => {
    console.log("iS clicked")
    const uid = "c54b8bb3a0016a1eec344c7baa8afd06";
    mutateFriend.mutate({uid})
  }
  return (
    <div className="h-96 bg-slate-950/30 shadow-lg shadow-slate-900 mb-5 p-3 flex justify-around items-center">
      <div className="flex  items-center h-full gap-8  px-5 py-2">
        <img
          src={user?.avatar}
          alt="user avatar"
          className="w-52 h-52  rounded-full ring ring-offset-4 outline-2 outline-transparent ring-offset-violet-300/50 "
        />
        <div>
          <p className="text-violet-200 text-3xl mb-2">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-violet-200/50 mb-5">
            "{user?.bio || 'this is a bio'}"
          </p>
          <button className="text-lg text-violet-200 bg-slate-950/50 px-4 py-2 shadow shadow-slate-900 hover:bg-slate-950 transition duration-200 cursor-pointer"  onClick={sendRequest}>
            Add Friend
          </button>
        </div>
      </div>
      <div className="bg-slate-900/10 shadow-lg shadow-slate-900  text-violet-100 p-5 flex flex-col gap-5 w-[25vmax]">
        <div className="flex gap-5 items-center justify-between w-full">
          <p className="text-lg tracking-wider">Username</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xl">
            {user?.username}
          </p>
        </div>
        <div className="flex gap-5 items-center justify-between w-full ">
          <p className="text-lg tracking-wider">Email</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xl">
            {user?.email}
          </p>
        </div>
        <div className="flex gap-5 items-center justify-between w-full">
          <p className="text-lg tracking-wider">Level</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xl">
            Beginner
          </p>
        </div>
        <div className="flex gap-5 items-center justify-between w-full">
          <p className="text-lg tracking-wider">Last login</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xl">
            {new Date(user?.last_login).getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
