import axiosApiInstance from "@/axiosApiInstance";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, Friend } from "@/types/friendTypes";

async function getSentRequests() {
  try {
    const { data } = await axiosApiInstance.get<ApiResponse<Friend[]>>("/friends/requests/sent");
    return data;
  } catch (e) {
    throw e;
  }
}

const useGetSentRequests = () => {
  return useQuery({
    queryKey: ["getSentRequests"],
    queryFn: getSentRequests,
  });
};

export default useGetSentRequests;
