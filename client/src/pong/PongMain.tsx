import { Outlet } from 'react-router-dom';
import api from '@/services/clientHttpService';
import { type CustomizationType } from './types/playMatch.ts';
import { useState, useEffect, createContext } from 'react';


export const CustomizationContext = createContext<CustomizationType | null>(null);

function useFetchCustomization(setCustomization: (value: CustomizationType) => void) {
  useEffect(() => {
    (async function fetchData() {
      try {
        const response = await api.get("/pongGame/remote/pongCustomization/fetch");
        setCustomization(response.data);
      } catch (err) {
        console.log("Fail to fetch customization.");
      }
    })();
  }, [])
}

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
