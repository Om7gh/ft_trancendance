import { useMutation, useQueryClient } from '@tanstack/react-query';
import FriendsService from '../auth/friends.service';

const useSendFriendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: FriendsService.sendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getSentRequests'] });
        },
    });
};

export default useSendFriendRequest;
