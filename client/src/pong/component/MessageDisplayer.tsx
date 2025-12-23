import { RxLapTimer } from 'react-icons/rx';

type MessageDisplayerPropsType = {
    message: string;
}

export default function MessageDisplayer({ message }: MessageDisplayerPropsType) {
  return (
    <div className=" bg-slate-950/60 shadow-xl shadow-slate-900 text-violet-200 px-2 py-6 text-xl flex gap-5 justify-center items-center">
      <RxLapTimer className="w-8 h-8" />
      <p className="">{message}</p>
    </div>
  );
}