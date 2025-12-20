import axiosApiInstance from "@/axiosApiInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/friendTypes";

interface SendFriendRequestPayload {
  uid: string;
}

async function sendFriendRequest(payload: SendFriendRequestPayload) {
  console.log(payload)
  try {
    const { data } = await axiosApiInstance.post<ApiResponse<null>>("/friends/requests", payload);
    return data;
  } catch (e) {
    throw e;
  }
}

const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getSentRequests"] });
    },
  });
};

export default useSendFriendRequest;
