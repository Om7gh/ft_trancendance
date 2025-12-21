import Enable2fa from "@/components/ui/settings/Enable2fa";
import UpdateAvatarBio from "@/components/ui/settings/UpdateAvatarBio";
import UpdatePassword from "@/components/ui/settings/UpdatePassword";
import { IoSettings } from "react-icons/io5";


function Settings() {
  return <div className="w-full h-full">
        <div className="pb-6 text-2xl bg-linear-30 from-violet-500 to-neon bg-clip-text text-transparent w-fit flex gap-4 items-center">
             <IoSettings className="w-10 h-10 text-violet-500" />
             <p className="text-3xl">Account Settings</p>
           </div>
   <div className="w-full h-full flex flex-col justify-evenly items-center">
    <div className="bg-violet-900/20 max-w-4xl w-full flex justify-center items-center p-6">
      <UpdateAvatarBio />
    </div>
    <div className="bg-violet-900/20 max-w-4xl w-full flex justify-center items-center p-6">
      <UpdatePassword />
    </div>
    <div className="bg-violet-900/20 max-w-4xl w-full flex justify-center items-center">
      <Enable2fa />
  </div>
  </div>
  </div>
}

export default Settings;
