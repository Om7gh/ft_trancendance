import { useState, useEffect } from "react";

export default function CounterDown() {
  const [counter, setCounter] = useState(15);

  useEffect(() => {
    let intervalId = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-0 from-violet-400 z-555 to-neon flex justify-evenly items-center  flex-col gap-2  rounded-lg">
      <h2 className="p-4 text-center text-slate-800">Waiting for opponent back to match</h2>
      <p className=" text-center text-slate-800">{counter}</p>
    </div>
  );
}