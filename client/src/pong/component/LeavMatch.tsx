import { useNavigate } from "react-router-dom";

type LeaveMatchPropsType = {
    matchState: string;
    connection: WebSocket;
}

export default function LeaveMatch({ matchState, connection}: LeaveMatchPropsType) {
    const navigate = useNavigate();
    
    return (
        <button
            className="m-auto block bg-slate-950/60 text-violet-200 px-6 py-3 text-xl shadow-xl w-1/2"
            onClick={() => {
                if (matchState === 'going') {
                    connection.send(
                        JSON.stringify({
                            type: 'leave',
                            data: true,
                        })
                    );
                }
                navigate('/dashboard/games/pingpong/remote');
            }}
        >Leave Match</button>
    )
}