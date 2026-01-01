import { Outlet } from 'react-router-dom';
import { useState, createContext } from 'react';
import { type CustomizationType } from './types/playMatch.ts';
import { useFetchCustomization } from './hooks/useFetchCustomization.ts';


export const CustomizationContext = createContext<CustomizationType | null>(null);

function PongMain() {
  const [customization, setCustomization] = useState<CustomizationType>({
    ball_color: "orange",
    left_paddle_color: "green",
    right_paddle_color: "red",
    table_edges_color: "white",
  });

  useFetchCustomization(setCustomization);

  return (
    <div className="h-full grid place-items-center">
      <CustomizationContext value={customization} >
        <Outlet />
      </CustomizationContext>
    </div>
  );
}

export default PongMain;
