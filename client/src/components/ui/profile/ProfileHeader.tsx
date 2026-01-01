import { useGetFriends, useGetReceivedRequests, useGetSentRequests, useApproveFriendRequest, useRejectFriendRequest, useSendFriendRequest, useUnfriend } from '@/services/friends';
import { BiLoaderAlt } from 'react-icons/bi';
import { useState } from 'react';
import type { Friend } from '@/types/friendTypes';

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
  const sendFriendRequest = useSendFriendRequest();
  const approveFriendRequest = useApproveFriendRequest();
  const rejectFriendRequest = useRejectFriendRequest();
  const unfriend = useUnfriend();

  const { data: receivedRequests } = useGetReceivedRequests();
  const { data: sentRequests } = useGetSentRequests();
  const { data: friends } = useGetFriends();

  const [activeAction, setActiveAction] = useState<
    null | 'send' | 'approve' | 'reject' | 'cancel' | 'unfriend'
  >(null);

  const uid = userData?.id;
  const hasReceivedRequestFromUser =
    !!uid && !!receivedRequests?.some((r: Friend) => r.id === uid);
  const hasSentRequestToUser =
    !!uid && !!sentRequests?.some((r: Friend) => r.id === uid);
  const isFriend = !!uid && !!friends?.some((f: Friend) => f.id === uid);

  const handleSendRequest = () => {
    if (!uid) return;
    setActiveAction('send');
    sendFriendRequest.mutate(uid, {
      onSettled: () => setActiveAction(null),
    });
  };

  const handleApproveRequest = () => {
    if (!uid) return;
    setActiveAction('approve');
    approveFriendRequest.mutate(uid, {
      onSettled: () => setActiveAction(null),
    });
  };

  const handleRejectRequest = () => {
    if (!uid) return;
    setActiveAction('reject');
    rejectFriendRequest.mutate(uid, {
      onSettled: () => setActiveAction(null),
    });
  };

  const handleCancelSentRequest = () => {
    if (!uid) return;
    setActiveAction('cancel');
    rejectFriendRequest.mutate(uid, {
      onSettled: () => setActiveAction(null),
    });
  };

  const handleUnfriend = () => {
    if (!uid) return;
    if (confirm(`Remove ${userData.username} from your friends?`)) {
      setActiveAction('unfriend');
      unfriend.mutate(uid, {
        onSettled: () => setActiveAction(null),
      });
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
            <div className="flex flex-wrap gap-2">
              {isFriend ? (
                <button
                  className="text-sm md:text-lg text-rose-200 bg-rose-600/50 px-4 py-2 shadow shadow-slate-900 hover:bg-rose-700/50 transition duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed rounded-xl"
                  onClick={handleUnfriend}
                  disabled={activeAction !== null}
                >
                  {activeAction === 'unfriend' ? (
                    <span className="inline-flex items-center gap-2">
                      <BiLoaderAlt className="animate-spin" /> Removing
                    </span>
                  ) : (
                    'Unfriend'
                  )}
                </button>
              ) : hasReceivedRequestFromUser ? (
                <>
                  <button
                    className="text-sm md:text-lg text-violet-200 bg-teal-500/50 rounded-xl px-4 py-2 shadow shadow-slate-900 hover:bg-teal-950 transition duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleApproveRequest}
                    disabled={activeAction !== null}
                  >
                    {activeAction === 'approve' ? (
                      <span className="inline-flex items-center gap-2 bg-teal-500">
                        <BiLoaderAlt className="animate-spin" /> Accepting
                      </span>
                    ) : (
                      'Accept'
                    )}
                  </button>
                  <button
                    className="text-sm md:text-lg text-violet-200 bg-pink-800/50 rounded-xl px-4 py-2 shadow shadow-slate-900 hover:bg-slate-950 transition duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleRejectRequest}
                    disabled={activeAction !== null}
                  >
                    {activeAction === 'reject' ? (
                      <span className="inline-flex items-center gap-2">
                        <BiLoaderAlt className="animate-spin" /> Rejecting
                      </span>
                    ) : (
                      'Reject'
                    )}
                  </button>
                </>
              ) : hasSentRequestToUser ? (
                <button
                  className="text-sm md:text-lg text-violet-200 bg-amber-600/50 px-4 py-2 shadow shadow-slate-900 hover:bg-amber-700/50 transition duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed rounded-xl"
                  onClick={handleCancelSentRequest}
                  disabled={activeAction !== null}
                >
                  {activeAction === 'cancel' ? (
                    <span className="inline-flex items-center gap-2">
                      <BiLoaderAlt className="animate-spin" /> Canceling
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      Cancel Request
                    </span>
                  )}
                </button>
              ) : (
                <button
                  className="text-sm md:text-lg rounded-xl text-violet-200 bg-slate-950/50 px-4 py-2 shadow shadow-slate-900 hover:bg-slate-950 transition duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleSendRequest}
                  disabled={activeAction !== null}
                >
                  {activeAction === 'send' ? (
                    <span className="inline-flex items-center gap-2">
                      <BiLoaderAlt className="animate-spin" /> Sending
                    </span>
                  ) : (
                    'Add Friend'
                  )}
                </button>
              )}
            </div>
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
