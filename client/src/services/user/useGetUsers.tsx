import { useQuery } from "@tanstack/react-query"

async function getUsers (searchQuery: string) {
        const response = await fetch(`http://localhost:8080/users/search?q=${searchQuery}`, {
            method: "GET",
        })
        if (!response.ok)
            throw await response.json()
        return await response.json()
}

function useGetUsers (searchQuery: string) {
    return useQuery({
        queryKey:["users", searchQuery],
        queryFn: () => getUsers(searchQuery),
        enabled: searchQuery.length > 0,
    })
}

export default useGetUsers
