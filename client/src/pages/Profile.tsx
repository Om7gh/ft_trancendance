import { GlobalContext } from '@/App';
import { useContext } from 'react';

function Profile() {
  const { user } = useContext(GlobalContext);
  console.log(user);

  return (
    <div>
      <div className="h-[10vmax] bg-slate-950/30 shadow-lg shadow-slate-900 mb-5 p-3 flex justify-around">
        <div className="flex items-center h-full gap-8  px-5 py-2">
          <img
            src={user?.avatar}
            alt="user avatar"
            className="w-36 h-36  rounded-full ring ring-offset-4 outline-2 outline-transparent ring-offset-violet-300/50 "
          />
          <div>
            <p className="text-violet-200 text-3xl mb-2">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-violet-200/50">
              "{user?.bio || 'this is a bio'}"
            </p>
          </div>
        </div>
        <div className="bg-violet-950/20 border border-violet-500/20 text-violet-100 p-5">
          <div className="flex gap-5 items-center">
            <p className="text-lg tracking-wider">Email:</p>
            <p className="bg-linear-0 from-violet-500 to-neon bg-clip-text text-transparent">
              {user?.email}
            </p>
          </div>
          <div>
            <p>Level:</p>
            <p>Beginner Player</p>
          </div>
        </div>
      </div>
      <div className="">statistic</div>
      <div className="">history</div>
    </div>
  );
}

export default Profile;
