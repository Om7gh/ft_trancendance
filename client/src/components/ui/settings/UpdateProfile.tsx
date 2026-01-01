import { GlobalContext } from '@/App';
import { useUpdateProfile } from '@/services/user/useUpdateProfile';
import { toast } from "react-toastify";
import type { ProfileData } from '@/types/auth.types';
import React, { useContext, useState } from 'react';

function UpdateProfile() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const { user } = useContext(GlobalContext);
    const [bio, setBio] = useState(() => user?.bio || '');
    const [firstName, setFirstName] = useState(() => user?.first_name || '');
    const [lastName, setLastName] = useState(() => user?.last_name || '');
    const [error, setError] = useState<string>('');
    const mutateUpdate = useUpdateProfile()

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (selected) {

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(selected.type)) {
                setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                e.target.value = '';
                return;
            }

            const maxSize = 1 * 1024 * 1024;
            if (selected.size > maxSize) {
                setError('File size must be less than 1 MB');
                e.target.value = '';
                return;
            }

            setError('');
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    }

    function validateName(name: string, fieldName: string): boolean {
        if (name.trim().length === 0) {
            setError(`${fieldName} is required`);
            return false;
        }

        return true;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!validateName(firstName, 'First name')
            || !validateName(lastName, 'Last name')) {
            return;
        }

        const updatedData: Partial<ProfileData> = {};

        if (file !== null) {
            updatedData.avatar = file;
        }
        if (bio !== (user?.bio || '')) {
            updatedData.bio = bio;
        }
        if (firstName !== (user?.first_name || '')) {
            updatedData.first_name = firstName;
        }
        if (lastName !== (user?.last_name || '')) {
            updatedData.last_name = lastName;
        }

        if (Object.keys(updatedData).length === 0) {
            toast.info("No changes to make");
            return;
        }

        mutateUpdate.mutate(updatedData as ProfileData)


    }

    return (
        <div className="flex-1  p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {(preview || user?.avatar) && (
                    <img
                        src={preview ?? user?.avatar}
                        alt="Avatar preview"
                        className="w-32 h-32 object-cover rounded-full mt-3 mx-auto border-2 border-slate-500"
                    />
                )}
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

                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>

                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a short bio…"
                    className="w-full h-32 p-3 rounded-lg bg-slate-700 text-slate-100 focus:outline-none"
                    maxLength={50}
                />

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-4 rounded-lg bg-violet-600 text-slate-100 hover:bg-violet-700 transition px-4 py-2 shadow-xl shadow-slate-900"
                >
                    Update
                </button>
            </form>
        </div>
    );
}

export default UpdateProfile;
