import { useMutation, useQueryClient } from '@tanstack/react-query';
import FriendsService from '../auth/friends.service';

const useCancelFriendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: FriendsService.cancel,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getSentRequests'],
            });
        },
    });
};

export default useCancelFriendRequest;
