import { useState, type JSX } from "react";

export default function LandingNavbar({
  mobile = false,
  className,
}: {
  mobile?: boolean;
  className?: string;
}): JSX.Element {
  const [active, setActive] = useState<number>(0);
  const links = ["Home", "About", "Features"];
  return (
    <ul
      className={
        mobile
          ? "flex flex-col space-y-2 text-center text-xl"
          : "flex space-x-8"
      }>
      {links.map((el, index) => (
        <li key={index}>
          <a
            href={`#${el}`}
            onClick={() => setActive(index)}
            className={index === active ? "active" : "link"}>
            {el}
          </a>
        </li>
      ))}
    </ul>
  );
}
