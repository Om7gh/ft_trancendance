import axiosApiInstance from "@/axiosApiInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/friendTypes";

async function approveFriendRequest(uid: string) {
  try {
    console.log(uid)
    const { data } = await axiosApiInstance.patch<ApiResponse<null>>(`/friends/requests/${uid}/approve`);
    return data;
  } catch (e) {
    throw e;
  }
}

const useApproveFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getReceivedRequests"] });
      queryClient.invalidateQueries({ queryKey: ["getFriends"] });
    },
  });
};

export default useApproveFriendRequest;
