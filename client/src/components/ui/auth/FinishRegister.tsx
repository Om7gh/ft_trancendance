import { useRef, useState } from "react";
import { Join } from "@assets";
import { useCompleteProfile } from "@/services/auth/useCompleteSignUp";
export default function FinishRegister() {
  const bioRef = useRef(null);
  const [charCount, setCharCount] = useState(50);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const mutateCompleteProfile = useCompleteProfile();

  const handleBioChange = (e) => {
    setCharCount(50 - e.target.value.length);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    mutateCompleteProfile.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gap-x-8">
      <img
        src={Join}
        alt="image"
        className="object-cover absolute w-full h-full opacity-5"
      />

      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden p-8 border-2 border-teal-400">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-orange-500 bg-clip-text text-transparent">
              PingPop
            </h2>
            <div className="w-8 h-8 bg-teal-400 rounded-full"></div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-300/70 mb-6 text-center">
          Complete Your Player Profile
        </h2>

        <form
          encType="multipart/form-data"
          className="space-y-6"
          onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center flex-col gap-6">
              <div
                className="relative w-20 h-20 rounded-lg bg-slate-700 border-2 border-orange-400 overflow-hidden cursor-pointer shadow-lg"
                onClick={triggerFileInput}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-300/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-orange-500 rounded-full"></div>
              </div>

              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                ref={fileInputRef}
              />

              <button
                type="button"
                onClick={triggerFileInput}
                className="px-4 py-2 border-2 border-teal-400 rounded-lg shadow-sm text-sm font-medium
                text-teal-300 bg-slate-700 hover:bg-teal-400/20 focus:outline-none focus:ring-2
                focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all">
                {avatarPreview ? "Change Avatar" : "Upload Photo"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-teal-300">
              Player Bio{" "}
              <span className="text-orange-400/80">(10-50 characters)</span>
            </label>
            <div className="relative">
              <textarea
                maxLength={50}
                minLength={10}
                name="bio"
                className="mt-1 block w-full px-4 py-3 border-2 border-teal-400 rounded-lg shadow-sm
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-teal-500
                placeholder-slate-500 text-teal-100 bg-slate-700/50 backdrop-blur-sm
                transition-all"
                rows={3}
                placeholder="Describe your play style..."
                ref={bioRef}
                onChange={handleBioChange}
              />
              <div className="absolute -bottom-5 right-0 px-2 py-1 bg-orange-500/90 text-slate-900 text-xs font-bold rounded-tl-md rounded-tr-md">
                {charCount} CHAR LEFT
              </div>
            </div>
          </div>

          <div className="flex space-x-4 justify-between pt-4">
            <button
              type="button"
              className="px-6 py-2 border-2 border-orange-500 rounded-lg shadow-sm text-sm font-medium
              text-orange-300 bg-slate-800 hover:bg-orange-500/20 focus:outline-none focus:ring-2
              focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
              onClick={() => navigate("/dashboard")}>
              Skip
            </button>
            <button
              type="submit"
              className="px-6 py-2 border-2 border-teal-400 rounded-lg shadow-sm text-sm font-medium
              text-slate-900 bg-gradient-to-r from-teal-400 to-orange-500 hover:from-teal-300 hover:to-orange-400
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
              focus:ring-offset-slate-800 font-bold transition-all">
              Let's go!
            </button>
          </div>
        </form>

        <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent relative">
          <div
            className="absolute top-0 left-0 right-0 h-full bg-repeat-x bg-[length:20px_1px]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #2dd4bf 0%, #2dd4bf 50%, transparent 50%, transparent 100%)",
            }}></div>
        </div>
      </div>
    </div>
  );
}
