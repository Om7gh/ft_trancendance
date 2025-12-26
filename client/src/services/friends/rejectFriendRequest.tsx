import { useMutation, useQueryClient } from '@tanstack/react-query';
import FriendsService from '../auth/friends.service';

const useRejectFriendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: FriendsService.rejectRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getReceivedRequests'],
            });
        },
    });
};

export default useRejectFriendRequest;
