import { useSendFriendRequest } from '@/services/friends';

interface UserData {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  bio: string;
  last_login: number;
  last_logout: number | null;
}

interface ProfileHeaderProps {
  userData: UserData;
  isOwnProfile: boolean;
}

function ProfileHeader({ userData, isOwnProfile }: ProfileHeaderProps) {
  const mutateFriend = useSendFriendRequest();

  const sendRequest = () => {
    if (userData?.id) {
      mutateFriend.mutate(userData.id);
    }
  };

  const getOnlineStatus = () => {
    if (!userData.last_logout) return 'Online';
    if (userData.last_login > userData.last_logout) return 'Online';
    return 'Offline';
  };

  console.log(userData)

  return (
    <div className="h-96 bg-slate-950/30 shadow-lg shadow-slate-900 mb-5 p-3 flex justify-around items-center">
      <div className="flex  items-center h-full gap-8  px-5 py-2">
        <img
          src={userData?.avatar}
          alt={`${userData?.username} avatar`}
          className="w-52 h-52  rounded-full ring ring-offset-4 outline-2 outline-transparent ring-offset-violet-300/50 "
        />
        <div>
          <p className="text-violet-200 text-3xl mb-2">
            {userData?.first_name} {userData?.last_name}
          </p>
          <p className="text-violet-200/50 mb-5">
            "{userData?.bio || 'No bio available'}"
          </p>
          {!isOwnProfile && (
            <button 
              className="text-lg text-violet-200 bg-slate-950/50 px-4 py-2 shadow shadow-slate-900 hover:bg-slate-950 transition duration-200 cursor-pointer" 
              onClick={sendRequest}
            >
              Add Friend
            </button>
          )}
        </div>
      </div>
      <div className="bg-slate-900/10 shadow-lg shadow-slate-900  text-violet-100 p-5 flex flex-col gap-5 w-[25vmax]">
        <div className="flex gap-5 items-center justify-between w-full">
          <p className="text-lg tracking-wider">Username</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xl">
            {userData?.username}
          </p>
        </div>
        <div className="flex gap-5 items-center justify-between w-full ">
          <p className="text-lg tracking-wider">Email</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xl truncate max-w-[200px]" title={userData?.email}>
            {userData?.email}
          </p>
        </div>
        <div className="flex gap-5 items-center justify-between w-full">
          <p className="text-lg tracking-wider">Status</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xl">
            {getOnlineStatus()}
          </p>
        </div>
        <div className="flex gap-5 items-center justify-between w-full">
          <p className="text-lg tracking-wider">Last login</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xl">
            {new Date(userData?.last_login).getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
