import { useQuery } from '@tanstack/react-query';
import FriendsService from '../auth/friends.service';

const useGetFriends = () => {
    return useQuery({
        queryKey: ['getFriend'],
        queryFn: FriendsService.getFriends,
    });
    // {data, error, isSuccess, isError}
};

export default useGetFriends;
