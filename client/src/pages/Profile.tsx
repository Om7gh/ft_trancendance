import { GlobalContext } from '@/App';
import { MyGamesHistory } from '@/components/ui';
import GamesStatistics from '@/components/ui/profile/GamesStatistics';
import ProfileHeader from '@/components/ui/profile/ProfileHeader';
import useGetProfile from '@/services/user/useGetProfile';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

function Profile() {
  const searchParams = useParams();
  const {user: currentUser} = useContext(GlobalContext)
  const {data, isPending, isError, error} = useGetProfile(searchParams?.username as string);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">
        <BiLoaderAlt className="text-violet-500 text-6xl animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-rose-400 text-2xl">Error loading profile: {error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-slate-400 text-2xl">Profile not found</p>
      </div>
    );
  }

  const { user, chess, pong, friends } = data;
  console.log("friend", friends)
  return (
    <div className='p-5 md:p-2'>
      <ProfileHeader userData={user} isOwnProfile={currentUser?.id === user.id} />
        <GamesStatistics chessStats={chess.stats} pongStats={pong} />
      <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <MyGamesHistory type="chess" userData={user} matchData={chess} />
          <MyGamesHistory type="pong" userData={user} matchData={pong} />
        </div>
      </div>
  );
}

export default Profile;
