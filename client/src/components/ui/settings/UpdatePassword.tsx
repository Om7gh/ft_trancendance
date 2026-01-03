
import { useUpdatePassword } from "@/services/user/useUpdatePassword"
import { InputField } from "../utils/Button"
import { useState, type FormEvent } from "react";
function UpdatePassword() {
    const [error, setError] = useState('');
    const mutate = useUpdatePassword(setError);

    const validatePassword = (password: string): boolean => {
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        return true;
    };

    const handleSubmit = (e: FormEvent<any>) => {
      e.preventDefault();
      setError('');
      
      const formdata = new FormData(e.currentTarget);
      const form = e.currentTarget;
      const oldPassword = formdata.get('oldpassword') as string;
      const confirmPassword = formdata.get('confirmNewPassword') as string;
      const password = formdata.get('newpassword') as string;

      if (!oldPassword.trim()) {
        setError('Current password is required');
        return;
      }

      if (!validatePassword(password)) {
        return;
      }

      if (confirmPassword !== password) {
        setError("Passwords don't match!");
        return;
      }

      const data = {
        current_password: oldPassword,
        new_password: password,
      }
      mutate.mutate(data, {
        onSuccess: () => {
          form.reset();
        }
      })
    }

    return (
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-200 mb-1">
              Update Password
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Change your account password
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="oldpassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Current Password
                </label>
                <InputField 
                  type="password" 
                  placeholder="Enter current password" 
                  name="oldpassword" 
                  id="oldpassword"
                />
              </div>

              <div>
                <label htmlFor="newpassword" className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <InputField 
                  type="password" 
                  placeholder="Enter new password" 
                  name="newpassword" 
                  id="newpassword"
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <InputField 
                  type="password" 
                  placeholder="Confirm new password" 
                  name="confirmNewPassword" 
                  id="confirmNewPassword"
                />
              </div>
        
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  <p className="text-sm text-rose-400">{error}</p>
                </div>
              )}
        
              <button 
                type="submit" 
                disabled={mutate.isPending}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 
                         text-white font-medium transition-colors shadow-lg shadow-violet-900/30
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutate.isPending ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}

export default UpdatePassword