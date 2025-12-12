import InputField from '../utils/InputField';
import { FaArrowRightLong } from 'react-icons/fa6';

function CreateUsername({ next }: { next: () => void }) {
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
          className="mb-4"
        />
        <button
          className="self-end text-lg bg-violet-800 cursor-pointer px-4 py-2 shadow-lg shadow-slate-900 flex items-center gap-2"
          onClick={next}
          // disabled={true}
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
