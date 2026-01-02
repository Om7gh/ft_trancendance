import { RxLapTimer } from 'react-icons/rx';
import getErrorMessage from '@/utils/getErrorMessage';

type MessageDisplayerPropsType = {
  message: unknown;
}

export default function MessageDisplayer({ message }: MessageDisplayerPropsType) {
  const text = getErrorMessage(message) || '';
  return (
    <div className=" bg-slate-950/20 shadow-xl shadow-slate-900 text-violet-200 px-2 py-6 text-xl my-6 flex gap-5 justify-center items-center">
      <RxLapTimer className="w-8 h-8" />
      <p className="">{text}</p>
    </div>
  );
}