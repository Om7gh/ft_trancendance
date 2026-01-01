import { useEffect } from 'react';
import api from '@/services/clientHttpService.ts';
import { type CustomizationType } from '../types/playMatch.ts';

export function useFetchCustomization(setCustomization: (value: CustomizationType) => void) {
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