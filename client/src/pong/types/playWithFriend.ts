export type FriendObject = {
    id          : string;
    username    : string;
    avatar      : string;
}

export type FriendPropsType = {
    friend      : FriendObject;
    setFriendId   : ((friend: string) => void);
}

export type ListFriendsPropsType = {
    setError: ((error: string) => void);
    setFriendId: ((friend: string) => void);
}