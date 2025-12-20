import { Ball1, Ball2, Racket, Table } from "@assets";

export default function Balls() {
  return (
    <>
      <img
        src={Ball1}
        alt="white-ball"
        className="absolute top-20 right-0 opacity-30 w-36"
      />
      <img
        src={Ball2}
        alt="white-ball"
        className="absolute left-2.5 opacity-10 w-25"
      />
      <img
        src={Racket}
        alt="white-ball"
        className="absolute bottom-2.5 opacity-40 w-75"
      />
      <img
        src={Table}
        alt="table"
        className="absolute top-1/2 left-1/2 opacity-15 w-[800px] translate-x-[-50%] translate-y-[-50%]"
      />
    </>
  );
}
