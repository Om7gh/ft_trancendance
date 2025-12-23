import { GlobalContext } from '@/App';
import { MyGamesHistory } from '@/components/ui';
import GamesStatistics from '@/components/ui/profile/GamesStatistics';
import ProfileHeader from '@/components/ui/profile/ProfileHeader';
import { useContext } from 'react';
import { IoStatsChart } from 'react-icons/io5';
import { MdOutlineHistory } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import FriendsList from '@/components/ui/profile/FriendsList';

function Profile() {
  const { user } = useContext(GlobalContext);
  return (
    <div>
      <ProfileHeader />
      <div className="my-10">
        <p className="text-3xl text-violet-400 mb-4 flex gap-4">
          <IoStatsChart className="text-violet-500" />
          {user.first_name}' statistics
        </p>
        <GamesStatistics />
      </div>
      <div className="my-10 grid grid-cols-2 gap-5">
        <div>
          <p className="text-3xl text-violet-400 mb-4 flex gap-4">
            <MdOutlineHistory className="text-violet-500" />
            {user.first_name}' Game history
          </p>
          <MyGamesHistory />
        </div>
        <div>
          <p className="text-3xl text-violet-400 mb-4 flex gap-4">
            <FaUserFriends className="text-violet-500" />
            {user.first_name}' friends
          </p>
          {/* <FriendsList /> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
