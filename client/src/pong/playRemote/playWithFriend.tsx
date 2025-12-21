import { useState } from "react";
import { useEffect } from "react";

import type { MatchType } from "./playWithSomeOne.tsx";

import { PlayMatch } from "./playMatch.tsx";
import { validateMatch, MessageDisplayer } from "./playWithSomeOne.tsx";

import axiosApiInstance from '../../axiosApiInstance.ts';
import useGetFriends from "@/services/friends/getFriends.tsx";

type FriendObject = {
    uid          : string;
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
                onClick={() => setFriend(friend.uid)}
            >Invite To Match</button>
        </div>
    )
}

type ListFriendsType = {
    setError: ((error: string) => void);
    setFriend: ((friend: string) => void);
}

function ListFriends({ setError, setFriend }: ListFriendsType) {
    // const [friends, setFriends] = useState<[] | null>(null);

    // useEffect(() => {
    //     let ignored = false;
    //     (async function fetchFriends() {
    //         try {
    //             const response =  await axiosApiInstance("/friends/");
    //             console.log("here..")
    //             if (!ignored && response) {
    //                 if (response.status === 200)
    //                     setFriends(response.data);
    //                 else
    //                     setError(response.data);  
    //             }
    //         } catch (err) {
    //             setError({reason: 'Fail to fetch match!!', errorCode: "E111"});
    //         }
    //     })();
    // }, []);

    const {data : friends, isError, error, isPending} = useGetFriends()

    if (isPending)
        return (<MessageDisplayer message="Fetching Your Friends..." />)
    if (isError)
        if (error)
            setError(error.message)
    if (friends?.length) 
        return (
            <div>
                {friends.map((friend: FriendObject) => {
                    return (<Friend key={friend.uid} friend={friend} setFriend={setFriend}/>)
                })}
            </div>
        );
        return (<MessageDisplayer message="Your friend list is empty" />)
}

export function PlayWithFriend() {
    const [error, setError] = useState<string | null>(null);
    const [friend, setFriend] = useState<string | null>(null);
    const [match, setMatch] = useState<MatchType | undefined>(undefined);
    const url = `/pongGame/remote/inviteFriend?q=send&fid=${friend}`;

    useEffect(() => {
        let ignored = false;

        if (friend) {
            (async function fetchMatch() {
                try {
                    const response = await axiosApiInstance.get(url);
                    if (!ignored && response) {
                        if (response.status === 200) {
                            if (!validateMatch(response.data)) {
                                setError("Error: fetch invalid match");
                                return;
                            }
                            setMatch(response.data);
                        } else
                            setMatch(response.data);
                    }
                } catch (err) {
                    setError('Fail to fetch match!!');
                }
            })();
        }

        return (() => {
            ignored = true;
        })
    }, [friend]);

    if (error)
        return <MessageDisplayer message={error} />;
    else if (match)
        return <PlayMatch match={match} />;
    
    return <ListFriends setError={setError} setFriend={setFriend}  />;
}