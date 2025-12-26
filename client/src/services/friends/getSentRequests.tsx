import { useQuery } from '@tanstack/react-query';
import FriendsService from '../auth/friends.service';

const useGetSentRequests = () => {
    return useQuery({
        queryKey: ['getSentRequests'],
        queryFn: FriendsService.getSentRequests,
    });
};

export default useGetSentRequests;
