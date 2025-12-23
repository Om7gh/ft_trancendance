import { useState } from "react";

import type { MatchType } from "../types/playWithSomeOne.ts";
import type { FriendObject, FriendPropsType, ListFriendsPropsType } from '../types/playWithFriend.ts';

import PlayMatch from "./playMatch.tsx";
import useFetchFriends from "../hooks/useFetchFriends.ts";
import useFetchMatch from '../hooks/useFetchMatch.ts';
import MessageDisplayer from "../component/MessageDisplayer.tsx";

function Friend({ friend, setFriendId }: FriendPropsType) {
    return (
        <div>
            <img src={friend.avatar} />
            <h1>{friend.username}</h1>
            <button
                onClick={() => setFriendId(friend.id)}
            >Invite To Match</button>
        </div>
    )
}

function ListFriends({ setError, setFriendId }: ListFriendsPropsType) {
    const [friends, setFriends] = useState<[] | null>(null);

    useFetchFriends(setFriends, setError);

    if (friends){
        if (friends.length) {
            return (
                <div>
                    {friends.map((friend: FriendObject) => {
                        return (<Friend key={friend.id} friend={friend} setFriendId={setFriendId}/>)
                    })}
                </div>
            );
        } else
            return (<MessageDisplayer message="Your friend list is empty" />)
    }
    return (<MessageDisplayer message="Fetching your friend list..." />)
}

export default function PlayWithFriend() {
    const [error, setError] = useState<string | null>(null);
    const [match, setMatch] = useState<MatchType | undefined>(undefined);
    const [friendId, setFriendId] = useState<string | null>(null);
    const url = `/pongGame/remote/inviteFriend?q=send&fid=${friendId}`;

    if (friendId) {
        useFetchMatch(url, setMatch, setError);
    }

    if (error)
        return <MessageDisplayer message={error} />;
    else if (match)
        return <PlayMatch match={match} />;
    else if (friendId)
        return <MessageDisplayer message="Waiting for friend to accept match invitation..." />;

    return <ListFriends setError={setError} setFriendId={setFriendId}  />;
}