
import { InputField } from "../utils/Button"
function UpdatePassword() {
 
    return (
      <div className="flex-1 p-6 ">
      <form className="flex flex-col gap-5">
        <div>
        <InputField type="password" placeholder="old password" name="oldpassword" id="oldpassword" />
        </div>
         <div>
        <InputField type="password" placeholder="new password" name="newpassword" id="newpassword" />
        </div> <div>
        <InputField type="password" placeholder="confirm new password" name="confirmNewPassword" id="confirmNewPassword" />
        </div>
          <button
                    type="submit"
                    className="mt-4 rounded-lg bg-violet-600 text-slate-100 hover:bg-violet-700 transition px-4 py-2 shadow-xl shadow-slate-900"
                    >
                    Update
                </button>
      </form>
    </div>
  )
}

export default UpdatePassword