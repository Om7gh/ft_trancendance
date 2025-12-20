import axiosApiInstance from "@/axiosApiInstance";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, Friend } from "@/types/friendTypes";

async function getFriends() {
  try {
    const { data } = await axiosApiInstance.get<ApiResponse<Friend[]>>("/friends/");
    return data.data;
  } catch (e) {
    throw e;
  }
}

const useGetFriends = () => {
  return useQuery({
    queryKey: ["getFriends"],
    queryFn: getFriends,
  });
};

export default useGetFriends;