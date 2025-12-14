import { useState } from "react";
import { useEffect } from "react";

import type { ErrorType, MatchType } from "./playWithSomeOne.tsx";

import { PlayMatch } from "./playMatch.tsx";
import { validateMatch, MessageDisplayer } from "./playWithSomeOne.tsx";

import axiosApiInstance from '../../axios.ts';

type FriendObject = {
    id          : string;
    username    : string;
    avatar      : string;
}

type FriendType = {
    friend      : FriendObject;
    setFriend   : ((friend: string) => void);
}

function Friend({ friend, setFriend }: FriendType) {
    return (
        <div>
            <img src={friend.avatar} />
            <h1>{friend.username}</h1>
            <button
                onClick={() => setFriend(friend.id)}
            >Invite To Match</button>
        </div>
    )
}

type ListFriendsType = {
    setError: ((error: ErrorType) => void);
    setFriend: ((friend: string) => void);
}

function ListFriends({ setError, setFriend }: ListFriendsType) {
    const [friends, setFriends] = useState<[] | null>(null);

    useEffect(() => {
        let ignored = false;
        (async function fetchFriends() {
            try {
                const response =  await axiosApiInstance("/pongGame/friends");
                if (!ignored && response) {
                    if (response.status === 200)
                        setFriends(response.data);
                    else
                        setError(response.data);  
                }
            } catch (err) {
                setError({reason: 'Fail to fetch match!!', errorCode: "E111"});
            }
        })();
    }, []);

    if (friends) 
        return (
            <div>
                {friends.map((friend: FriendObject) => {
                    return (<Friend key={friend.id} friend={friend} setFriend={setFriend}/>)
                })}
            </div>
        );

    return (<MessageDisplayer message="Fetching Your Friends..." />)
}

export function PlayWithFriend() {
    const [error, setError] = useState<ErrorType | null>(null);
    const [friend, setFriend] = useState<string | null>(null);
    const [match, setMatch] = useState<MatchType | undefined>(undefined);
    const url = `/pongGame/invite?fid=${friend}`;

    useEffect(() => {
        let ignored = false;

        if (!friend) {
            (async function fetchMatch() {
                try {
                    const response = await axiosApiInstance.get(url);
                    if (!ignored && response) {
                        if (response.status === 200) {
                            if (!validateMatch(response.data)) {
                                setError({reason: "Error: fetch invalid match", errorCode: "E111"});
                                return;
                            }
                            setMatch(response.data);
                        } else
                            setMatch(response.data);
                    }
                } catch (err) {
                    setError({reason: 'Fail to fetch match!!', errorCode: "E111"});
                }
            })();
        }

        return (() => {
            ignored = true;
        })
    }, [friend]);
    
    if (error)
        return <MessageDisplayer message={error.reason + " " + error.errorCode} />;
    else if (match)
        return <PlayMatch match={match} />;
    
    return <ListFriends setError={setError} setFriend={setFriend}  />;
}