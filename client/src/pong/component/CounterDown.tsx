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
    <div className="border rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="p-4 text-center">Waiting for opponent back to match</h1>
      <p className="p-4 text-center">{counter}</p>
    </div>
  );
}