import { useQuery } from "@tanstack/react-query"
import AuthService from "../auth/auth.service"


function useGetUsers (searchQuery: string) {
    return useQuery({
        queryKey:["users", searchQuery],
        queryFn: () => AuthService.getProfile(searchQuery),
        enabled: searchQuery.length > 0,
    })
}

export default useGetUsers
