import { useMutation, useQueryClient } from "@tanstack/react-query";
import FriendsService from "../auth/friends.service";


const useApproveFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FriendsService.accept,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getReceivedRequests"] });
      queryClient.invalidateQueries({ queryKey: ["getFriends"] });
    },
  });
};

export default useApproveFriendRequest;
