import axiosApiInstance from "@/axiosApiInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/friendTypes";

async function unfriend(uid: string) {
  try {
    const { data } = await axiosApiInstance.delete<ApiResponse<null>>(`/friends/${uid}`);
    return data;
  } catch (e) {
    throw e;
  }
}

const useUnfriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getFriends"] });
    },
  });
};

export default useUnfriend;
