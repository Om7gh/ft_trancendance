import Enable2fa from "@/components/ui/settings/Enable2fa";
import UpdateAvatarBio from "@/components/ui/settings/UpdateAvatarBio";
import UpdatePassword from "@/components/ui/settings/UpdatePassword";
import { IoSettings } from "react-icons/io5";
import { GrUpdate } from "react-icons/gr";
import { SiAwssecretsmanager } from "react-icons/si";
import { Si2Fas } from "react-icons/si";
import { useContext } from "react";
import { GlobalContext } from "@/App";

function AccountSettings() {
   const {user} = useContext(GlobalContext)
  return (
    <div className="w-full h-full">
      <div className="px-4 pt-2">
        <div className="text-2xl bg-linear-30 from-violet-500 to-neon bg-clip-text text-transparent w-fit flex gap-4 items-center my-3">
          <IoSettings className="w-8 h-8 md:w-10 md:h-10 text-violet-500" />
          <p className="text-xl md:text-3xl">Account Settings</p>
        </div>
      </div>

      <div className="px-4 w-full max-w-400 mx-auto flex flex-col justify-start h-full gap-10">

        <div className="w-full flex flex-col md:flex-row items-center gap-6 p-4 bg-linear-to-b from-slate-950/20 to-violet-950/20">
          <div className="w-full md:w-1/2 flex flex-col items-center gap-6 justify-start text-center px-6">
            <GrUpdate className="w-12 h-12 md:w-24 md:h-24 text-violet-500" />
            <div className="text-base bg-linear-to-l from-violet-500 to-neon text-transparent bg-clip-text text-center max-w-[80%] md:text-2xl tracking-wider">
              <p>Update to a new and attractive avatar</p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <UpdateAvatarBio />
          </div>
        </div>

        {
          user?.provider === "local" &&
          <div className="w-full flex flex-col md:flex-row items-center gap-6 p-4 ">
          <div className="w-full md:w-1/2">
            <UpdatePassword />
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center gap-6 justify-start text-center px-6">
            <SiAwssecretsmanager className="w-12 h-12 md:w-24 md:h-24 text-violet-500" />
            <p className="text-base bg-linear-to-l from-violet-500 to-neon text-transparent bg-clip-text text-center max-w-[80%] md:text-2xl tracking-wider">
              Protect Yourself With updating your password
            </p>
          </div>
        </div>
        }



        <div className="w-full flex flex-col md:flex-row items-center gap-6 p-4 bg-linear-to-b from-slate-950/20 to-violet-950/20">
          <div className="w-full md:w-1/2 flex flex-col items-center gap-6 justify-start text-center px-6">
            <Si2Fas className="w-12 h-12 md:w-24 md:h-24 text-violet-500" />
            <p className="text-base bg-linear-to-l from-violet-500 to-neon text-transparent bg-clip-text text-center max-w-[80%] md:text-2xl tracking-wider">
              enable 2fa for extra security layer
            </p>
          </div>
            <Enable2fa />
        </div>
      </div>
    </div>
  )
}

export default AccountSettings;
