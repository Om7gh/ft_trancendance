import { Outlet } from 'react-router-dom';

function PongMain() {
  return (
    <div className="h-full grid place-items-center">
      <Outlet />
    </div>
  );
}

export default PongMain;
