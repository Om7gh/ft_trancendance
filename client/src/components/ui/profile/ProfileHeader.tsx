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

  const getTimeSinceLastLogin = () => {
    if (!userData?.last_login) return 'Unknown';
    
    const now = Date.now();
    const lastLogin = userData.last_login * 1000;
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

  return (
    <div className="h-96 bg-slate-950/30 shadow-lg shadow-slate-900 mb-5 p-3 flex flex-col md:flex-row justify-around items-center rounded-xl">
      <div className="flex  items-center h-full gap-8  px-5 py-2">
        <img
          src={userData?.avatar}
          alt={`${userData?.username} avatar`}
          className="w-32 h-32 md:h-52 md:w-52  rounded-full ring ring-offset-4 outline-2 outline-transparent ring-offset-violet-300/50 "
        />
        <div>
          <p className="text-violet-200 text-lg md:text-3xl mb-2">
            {userData?.first_name} {userData?.last_name}
          </p>
          <div className="text-violet-500 mb-5 text-xs md:text-lg">
            <p>{userData?.bio}</p>
          </div>
          {!isOwnProfile && (
            <button 
              className="text-sm md:text-lg text-violet-200 bg-slate-950/50 px-4 py-2 shadow shadow-slate-900 hover:bg-slate-950 transition duration-200 cursor-pointer" 
              onClick={sendRequest}
            >
              Add Friend
            </button>
          )}
        </div>
      </div>
      <div className="bg-slate-900/10 shadow-lg shadow-slate-900  text-violet-100 p-5 flex flex-col gap-5  w-full md:w-[25vmax]">
        <div className="flex gap-5 items-center justify-between w-full">
          <p className="text-sm md:text-lg tracking-wider">Username</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xs md:text-xl">
            {userData?.username}
          </p>
        </div>
        <div className="flex gap-5 items-center justify-between w-full ">
          <p className="text-sm md:text-lg tracking-wider">Email</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xs md:text-lg" title={userData?.email}>
            {userData?.email.split("@")[0] + "..."}
          </p>
        </div>
        {!isOwnProfile && (
        <div className="flex gap-5 items-center justify-between w-full">
          <p className="text-sm md:text-lg tracking-wider">Status</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xs md:text-xl">
            {getOnlineStatus()}
          </p>
        </div>
        )}
        <div className="flex gap-5 items-center justify-between w-full">
          <p className="text-xs md:text-lg tracking-wider">Last login</p>
          <p className="bg-linear-180 from-violet-500 to-neon bg-clip-text text-transparent text-xs md:text-xl">
            {getTimeSinceLastLogin()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
