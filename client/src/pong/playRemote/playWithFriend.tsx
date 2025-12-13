import { useState } from "react";
import { useEffect } from "react";

import type { MatchType } from "./playWithSomeOne.tsx";

import { PlayMatch } from "./playMatch.tsx";
import axiosApiInstance from '../../axios.ts';
import { validateMatch, MessageDisplayer } from "./playWithSomeOne.tsx";

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
    setError: ((friend: string) => void);
    setFriend: ((friend: string) => void);
}

function ListFriends({ setError, setFriend }: ListFriendsType) {
    const [friends, setFriends] = useState<[] | null>(null);

    useEffect(() => {
        let ignored = false;

        (async function fetchFriends() {
            const resp =  await axiosApiInstance("/pongGame/friends");

            if (!ignored) {
                if (resp.status === 200) {
                    setFriends(resp.data);
                } else {
                    setError("Fail to fetch you friends!!");
                }  
            }
        })();
    }, []);

    if (friends) {
        return (
            <div>
                {
                    friends.map((friend: FriendObject) => {
                        return (<Friend key={friend.id} friend={friend} setFriend={setFriend}/>)
                    })
                }
            </div>
        )
    }

    return (<p>Fetching Your Friends...</p>)
}

export function PlayWithFriend() {
    const [error, setError] = useState<string | null>(null);
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
                                setError('Error: fetched an invalid match!!');
                                return;
                            }
                            setMatch(response.data);
                        } else {
                            setError('Waiting too long try after few seconds!!');
                        }
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
    
    if (error) {
        return <MessageDisplayer message={error!} />;
    } else if (match) {
        return <PlayMatch match={match} />;
    }
    
    return <ListFriends setError={setError} setFriend={setFriend}  />;
}