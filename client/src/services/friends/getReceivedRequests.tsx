import { useQuery } from '@tanstack/react-query';
import FriendsService from '../auth/friends.service';

const useGetReceivedRequests = () => {
    return useQuery({
        queryKey: ['getReceivedRequests'],
        queryFn: FriendsService.getReceivedRequests,
    });
};

export default useGetReceivedRequests;
