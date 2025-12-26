import { useMutation, useQueryClient } from '@tanstack/react-query';
import FriendsService from '../auth/friends.service';

const useUnfriend = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: FriendsService.unfriend,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getFriends'] });
        },
    });
};

export default useUnfriend;
