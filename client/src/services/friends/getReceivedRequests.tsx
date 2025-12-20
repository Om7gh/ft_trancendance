import axiosApiInstance from "@/axiosApiInstance";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, Friend } from "@/types/friendTypes";

async function getReceivedRequests() {
  try {
    const { data } = await axiosApiInstance.get<ApiResponse<Friend[]>>("/friends/requests/received");
    return data.data;
  } catch (e) {
    throw e;
  }
}

const useGetReceivedRequests = () => {
  return useQuery({
    queryKey: ["getReceivedRequests"],
    queryFn: getReceivedRequests,
  });
};

export default useGetReceivedRequests;
