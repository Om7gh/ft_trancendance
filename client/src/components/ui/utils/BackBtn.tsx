import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/solid';
import type { MouseEvent } from 'react';

export default function BackBtn() {
  const navigate = useNavigate();

  const handleClick = (e : MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-5 left-5 group flex items-center justify-center w-10 h-10 bg-slate-900/50 hover:bg-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 z-50 border-t-5 0 border-l-5 border-violet-500 border-r-1 border-b-1"
      aria-label="Go back"
    >
      <ArrowLeftCircleIcon className="h-8 w-8 text-slate-100 group-hover:-translate-x-0.5 transition-transform duration-200 " />
    </button>
  );
}
