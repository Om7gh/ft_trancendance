
import { useUpdatePassword } from "@/services/user/useUpdatePassword"
import { InputField } from "../utils/Button"
import { useState, type FormEvent } from "react";
function UpdatePassword() {
    const mutate = useUpdatePassword();
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleSubmit = (e: FormEvent<any>) => {
      e.preventDefault();
      const formdata = new FormData(e.currentTarget);
      const confirmPassword = formdata.get('confirmNewPassword') as string;
      const password = formdata.get('newpassword') as string;

      if (confirmPassword !== password) {
        setPasswordsMatch(false)
        return ;
      }
    setPasswordsMatch(true);
      const data = {
        current_password: formdata.get("oldpassword") as string,
        new_password: formdata.get("newpassword") as string,
      }
      mutate.mutate(data)
    }

    return (
      <div className="flex-1 p-6 ">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div>
        <InputField type="password" placeholder="old password" name="oldpassword" id="oldpassword" />
        </div>
         <div>
        <InputField type="password" placeholder="new password" name="newpassword" id="newpassword" />
        </div> <div>
        <InputField type="password" placeholder="confirm new password" name="confirmNewPassword" id="confirmNewPassword" />
        {!passwordsMatch && (
                <p className="mt-1 text-sm text-red-400">
                  Passwords don't match!
                </p>
              )}
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