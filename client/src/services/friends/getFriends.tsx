import { useQuery } from '@tanstack/react-query';
import FriendsService from '../auth/friends.service';

const useGetFriends = () => {
    return useQuery({
        queryKey: ['getFriends'],
        queryFn: FriendsService.getFriends,
    });
    // {data, error, isSuccess, isError}
};

export default useGetFriends;
