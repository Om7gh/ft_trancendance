import { GlobalContext } from "@/App"
import { useContext } from "react"

function GamesHistory({type} : {type: string}) {
    const {user} = useContext(GlobalContext)
    if (type === 'chess')
        return <div>GamesHistory</div>
    else if (type === "pong")
        return <div></div>
}

export default GamesHistory