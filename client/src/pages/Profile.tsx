import { useTransStore } from '@/store/useTransStore';

function Profile() {
  const user = useTransStore((state) => state.user);
  console.log(user);

  return (
    <div>
      <div className="h-[10vmax] bg-slate-950/30 shadow-lg shadow-slate-900 mb-5 p-3">
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
            <p className="text-violet-200/50">"{user?.bio}"</p>
          </div>
        </div>
      </div>
      <div className="">statistic</div>
      <div className="">history</div>
    </div>
  );
}

export default Profile;
