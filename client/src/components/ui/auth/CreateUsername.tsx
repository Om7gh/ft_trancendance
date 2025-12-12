import { useEffect, useState } from 'react';
import InputField from '../utils/InputField';
import { FaArrowRightLong } from 'react-icons/fa6';
import axiosApiInstance from '@/axios';
import { MdErrorOutline } from 'react-icons/md';

function CreateUsername({ next }: { next: () => void }) {
  const [isValid, setIsvalid] = useState(false);
  const [error, setError] = useState('salam');
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        addEventListener('input', (e) => {
          axiosApiInstance.post(
            `/auths/check-username?username=${e.currentTarget}`
          );
          setIsvalid(true);
        });
      } catch (e) {
        setError(e.message);
        setIsvalid(false);
      }
    }, 400);
    return () => clearTimeout(id);
  }, []);
  return (
    <div>
      <h2 className="text-center text-2xl my-6 text-slate-200">
        Choose Username
      </h2>
      <div className="flex flex-col">
        <InputField
          type="text"
          id="username"
          name="username"
          required
          placeholder="Choose username"
          className={`${error.length ? 'bg-pink-500 text-red-600' : 'boder'}`}
        />
        {error.length && (
          <p className="text-lg text-pink-500 my-2 flex items-center gap-3">
            {' '}
            <MdErrorOutline /> {error}
          </p>
        )}
        <button
          className="self-end text-lg bg-violet-800 cursor-pointer px-4 py-2 shadow-lg shadow-slate-900 flex items-center gap-2"
          onClick={next}
          disabled={isValid}
        >
          <span>next</span>
          <span>
            <FaArrowRightLong />
          </span>
        </button>
      </div>
    </div>
  );
}

export default CreateUsername;
