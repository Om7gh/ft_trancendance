import { useQuery } from "@tanstack/react-query";

async function getPlayers() {
  const res = await fetch("http://localhost:3001/players");
  const data = await res.json();
  return data;
}

function useFetchAllPlayers() {
  const {
    data: players,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  return { players, isPending, isError };
}

export default useFetchAllPlayers;
