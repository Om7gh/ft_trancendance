import { useQuery } from "@tanstack/react-query"


async function getProfileData (username: string) {
        const response = await fetch(`http://localhost:8080/users/${username}`, {
            method: "GET",
        })
        if (!response.ok)
            throw await response.json()
        return await response.json()
}

function useGetProfile (username: string) {
    return useQuery({
        queryKey:["profile"],
        queryFn: () => getProfileData(username),

    })
}

export default useGetProfile