import { GlobalContext } from '@/App';
import { MyGamesHistory } from '@/components/ui';
import GamesStatistics from '@/components/ui/profile/GamesStatistics';
import ProfileHeader from '@/components/ui/profile/ProfileHeader';
import useGetProfile from '@/services/user/useGetProfile';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { FaUserSlash, FaExclamationTriangle } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';

function Profile() {
  const searchParams = useParams();
  const navigate = useNavigate();
  const {user: currentUser} = useContext(GlobalContext)
  const {data, isPending, isError, error, refetch} = useGetProfile(searchParams?.username as string);

  useEffect(() => {
        refetch()
  }, [searchParams?.username])

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-96">
        <BiLoaderAlt className="text-violet-500 text-6xl animate-spin" />
      </div>
    );
  }

  if (isError) {
    const is404 = error?.status === 404 || error?.response?.status === 404;
    return (
      <div className="flex justify-center items-center min-h-[600px] px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className={`p-4 rounded-full ${is404 ? 'bg-slate-700/30' : 'bg-rose-500/10'} border ${is404 ? 'border-slate-600/50' : 'border-rose-500/30'}`}>
              {is404 ? (
                <FaUserSlash className="w-16 h-16 text-slate-500" />
              ) : (
                <FaExclamationTriangle className="w-16 h-16 text-rose-400" />
              )}
            </div>
          </div>

          <h2 className={`text-2xl font-bold mb-3 ${is404 ? 'text-slate-300' : 'text-rose-400'}`}>
            {is404 ? 'Profile Not Found' : 'Error Loading Profile'}
          </h2>

          <p className="text-slate-400 mb-6">
            {is404
              ? `The user "${searchParams?.username}" doesn't exist or may have been removed.`
              : error?.response?.data?.message || 'An unexpected error occurred while loading the profile.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-600/50"
            >
              <IoArrowBack />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-lg transition-colors border border-violet-500/30"
            >
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { user, chess, pong } = data;
  return (
    <div className='p-5 md:p-2 max-w-400 m-auto'>
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
