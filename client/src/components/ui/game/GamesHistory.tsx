
function GamesHistory({type} : {type: string}) {
    if (type === 'chess')
        return <div>GamesHistory</div>
    else if (type === "pong")
        return <div></div>
}

export default GamesHistory