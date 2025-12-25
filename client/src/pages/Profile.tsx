import { GlobalContext } from '@/App';
import { MyGamesHistory } from '@/components/ui';
import GamesStatistics from '@/components/ui/profile/GamesStatistics';
import ProfileHeader from '@/components/ui/profile/ProfileHeader';
import { IoStatsChart } from 'react-icons/io5';
import { MdOutlineHistory } from 'react-icons/md';
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

  const { user, chess, pong } = data;

  console.log(chess)

  return (
    <div>
      <ProfileHeader userData={user} isOwnProfile={currentUser?.id === user.id} />
      <div className="my-10">
        <p className="text-3xl text-violet-400 mb-4 flex gap-4">
          <IoStatsChart className="text-violet-500" />
          {user.first_name}' statistics
        </p>
        <GamesStatistics chessStats={chess.stats} pongStats={pong} />
      </div>
      <div className="my-10 grid grid-cols-2 gap-5">
        <div>
          <p className="text-3xl text-violet-400 mb-4 flex gap-4">
            <MdOutlineHistory className="text-violet-500" />
            {user.first_name}' Chess history
          </p>
          <MyGamesHistory type="chess" userData={user} matchData={chess} />
        </div>
        <div>
          <p className="text-3xl text-violet-400 mb-4 flex gap-4">
            <MdOutlineHistory className="text-violet-500" />
            {user.first_name}' Pong history
          </p>
          {/* <FriendsList /> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
