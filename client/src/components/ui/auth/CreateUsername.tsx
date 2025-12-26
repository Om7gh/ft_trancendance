import AuthService from '@/services/auth/auth.service';
import useCreateUsername from '@/services/auth/useCreateUsername';
import { useEffect, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdErrorOutline } from 'react-icons/md';

function CreateUsername({ next }: { next: () => void }) {
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const mutateUsername = useCreateUsername();

  useEffect(() => {
    if (!username) {
      setIsValid(false);
      setError('');
      return;
    }

    async function check() {
      try {
        setLoading(true);
        setError('');
        await AuthService.checUsername({username})
        setIsValid(true);
      } catch (err) {
        setIsValid(false);
        setError(err?.message || 'Username already taken');
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [username]);

  const handleClick = () => {
    if (username) {
      mutateUsername.mutate({ username });
      next();
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl my-6 text-slate-200">
        Choose Username
      </h2>

      <div className="flex flex-col">
        <input
          type="text"
          id="username"
          name="username"
          required
          placeholder="Choose username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`  bg-slate-900/50 backdrop-blur-sm
          border-2 border-violet-500/30
          text-slate-200 placeholder-slate-500 
           outline-none text-lg
          focus:border-neon focus:shadow-[0_0_20px_rgba(139,92,246,0.4)]
          transition-all duration-300 px-6 py-4`}
        />

        <p
          className={` ${
            error.length ? 'visible' : 'invisible'
          } text-lg text-pink-500 my-2 flex items-center gap-3`}
        >
          <MdErrorOutline /> {error}
        </p>

        <button
          className="self-end text-lg bg-violet-800 px-4 py-2 shadow-lg shadow-slate-900 flex items-center gap-2 disabled:opacity-50"
          onClick={handleClick}
          disabled={!isValid || loading}
        >
          <span>Next</span>
          <FaArrowRightLong />
        </button>
      </div>
    </div>
  );
}

export default CreateUsername;
