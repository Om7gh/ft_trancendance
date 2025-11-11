import { useNavigate } from "react-router-dom";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";

export default function BackBtn() {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-5 left-5 group flex items-center justify-center w-16 h-16 rounded-full bg-teal-600 hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 z-50"
      aria-label="Go back">
      <ArrowLeftCircleIcon className="h-8 w-8 text-white group-hover:-translate-x-0.5 transition-transform duration-200 " />
    </button>
  );
}
