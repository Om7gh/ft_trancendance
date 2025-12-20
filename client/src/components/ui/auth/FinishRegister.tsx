import axiosApiInstance from '@/axiosApiInstance';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function FinishRegister({ next }: { next: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const navigate = useNavigate();
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('avatar', file!);
    formData.append('bio', bio);
    try {
      await axiosApiInstance.post('/auths/complete-profile', {
        avatar: file,
        bio,
      });
      toast.success('Registration completed successfully');
      navigate('/dashboard');
    } catch (e) {}
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-800/60 rounded-xl shadow-lg">
      <h2 className="text-center text-2xl mb-6 text-slate-100">
        Choose Avatar & Bio
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative group">
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="avatar"
            className={`flex items-center justify-center gap-3 px-6 py-3 
            bg-slate-900/50 border-2 border-violet-500/30 
            text-slate-300 font-medium cursor-pointer
            hover:border-neon hover:bg-slate-800/50 
            hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]
            transition-all duration-300 
            group-hover:text-white`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Choose file</span>
          </label>
        </div>

        {preview && (
          <img
            src={preview}
            alt="Avatar preview"
            className="w-32 h-32 object-cover rounded-full mt-3 mx-auto border-2 border-slate-500"
          />
        )}

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio…"
          className="w-full h-32 p-3 rounded-lg bg-slate-700 text-slate-100 focus:outline-none"
          minLength={10}
          maxLength={50}
        />

        <button
          type="submit"
          className="mt-4 rounded-lg bg-violet-600 text-slate-100 hover:bg-violet-700 transition self-end px-4 py-2 shadow-xl shadow-slate-900"
        >
          Finish
        </button>
      </form>
    </div>
  );
}

export default FinishRegister;
