import axiosApiInstance from "@/axiosApiInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/friendTypes";

async function rejectFriendRequest(uid: string) {
  try {
    const { data } = await axiosApiInstance.delete<ApiResponse<null>>(`/friends/requests/${uid}/reject`);
    return data;
  } catch (e) {
    throw e;
  }
}

const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getReceivedRequests"] });
    },
  });
};

export default useRejectFriendRequest;
