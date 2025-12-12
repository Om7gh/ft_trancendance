import { useNavigate } from "react-router";
import { useRef, useState, useEffect } from "react";

import type { ScoreType } from "./playMatch.tsx";
import type { MatchType, PlayerType } from "./playWithSomeOne.tsx";

import { ScoreBar } from "./ScoreBare.tsx";
import { Events } from "../playLocal/pongClasses.tsx";

const events         = new Events;

function handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if ((key === "w") || (key === "s") || (key === "arrowup") || (key === "arrowdown")) {
        event.preventDefault();
        if (events) {
            events[key] = true;
        }
    }
}

function handleKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if ((key === "w") || (key === "s") || (key === "arrowup") || (key === "arrowdown")) {
        event.preventDefault();
        if (events) {
            events[key] = false;
        }
    }
}

function sendEvents(ws: WebSocket, matchState: string) {
    if (events && (matchState === "going")) {
        if (events["w"] || events["arrowup"]) {
            ws.send(JSON.stringify({
                type: "move",
                data: {move: "up"}
            }))
        }
        if (events["s"] || events["arrowdown"]) {
            ws.send(JSON.stringify({
                type: "move",
                data: {move: "down"}
            }))
        }
    }
}

type Ball = {
    x       : number,
    y       : number,
    radius  : number,
}

function drawBall(ball: Ball, context: CanvasRenderingContext2D | null, color = "orange") {
    if (ball && context) {
        context.beginPath();
        context.fillStyle = color;
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
        context.fill();
    }
}

type Paddle = {
    x       : number,
    y       : number,
    width   : number,
    height  : number,
}

function drawPaddle(paddle: Paddle, context: CanvasRenderingContext2D, color = "black") {
    if (paddle && context) {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth   = paddle.width;
        context.moveTo(paddle.x, paddle.y);
        context.lineTo(paddle.x, (paddle.y + paddle.height));
        context.closePath();
        context.stroke();
    }
}

type MessageHandlerType = {
    event           : MessageEvent;
    context         : CanvasRenderingContext2D;
    setScore        : ((value: ScoreType) => void);
    setMatchState   : ((value: string) => void);
}

function messageHandler({event, context, setScore, setMatchState }: MessageHandlerType) {
    let message = JSON.parse(event.data);

    if (message.state === "ok") {
        if (message.data.event === "updateView") {
            context.clearRect(0, 0, 700, 400)
            drawBall    (message.data.ball, context, "orange");
            drawPaddle  (message.data.leftPaddle, context, "green");
            drawPaddle  (message.data.rightPaddle, context, "red");
        } else if (message.data.event === "updateScore") {
            setScore({
                leftPlayer: message.data.leftPlayer,
                rightPlayer: message.data.rightPlayer,
            });
        } else if (message.data.event === "matchState") {
            setMatchState(message.data.value);
        }
    }
}

type synchronizePongStateType = {
    connection      : WebSocket;
    context         : CanvasRenderingContext2D;
    setScore        : ((value: ScoreType) => void);
    matchState      : string;
    setMatchState   : ((value: string) => void);
}

function synchronizePongState({ connection, context, setScore, matchState, setMatchState }: synchronizePongStateType ) {
    let intervalId            = null;

    connection.onmessage = (event) => {
        messageHandler(
            {
                event: event,
                context: context,
                setScore: setScore,
                setMatchState: setMatchState
            }
        );
    }

    intervalId = setInterval(() => sendEvents(connection, matchState), 30);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("keydown", handleKeyDown);

    return (() => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
        connection.onmessage = null;
        clearInterval(intervalId);
    })
}

function CounterDown() {
    const [counter, setCounter] = useState(15);

    useEffect(() =>{
        
        let intervalId  = setInterval(()=>{
            setCounter((prev) => prev - 1);
        }, 1000)
        
        return (() => {clearInterval(intervalId)});
    }, [])

    return(
        <div className="border rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <h1 className="p-4 text-center">Waiting for opponent back to match</h1>
            <p className="p-4 text-center">{counter}</p>
        </div>
    )
}

type WinnerPropsType = {
    score: ScoreType;
    match: MatchType;
}

export function Winner({ score, match }: WinnerPropsType) {
    const [winner, setWinner] = useState<PlayerType | null>(null)

    useEffect(() => {
        if (score) {
            if (score.leftPlayer < score.rightPlayer)
                setWinner(match.rightPlayer);
            else if (score.rightPlayer < score.leftPlayer)
                setWinner(match.leftPlayer);
        }
    }, [])

    return (
        <div className="border rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tflex flex-col m-auto">
            <img className="w-1/4 m-auto my-4" 
                src={winner?.avatar}
            />
            <h1 className='text-[1em] m-auto text-center m-auto my-4'>Winner is: {winner && winner.name || "No Winner!!"}</h1>
        </div>
    )
}

type MatchPropsType = {
    connection          : WebSocket;
    score               : ScoreType;
    matchState          : string;
    match               : MatchType;
    setScore            : ((value: ScoreType) => void);
    setMatchState       : ((value: string) => void);
}

export function Match({ connection, score, matchState, match, setScore, setMatchState }: MatchPropsType) {
    const  navigate             = useNavigate();
    const  canvasRef            = useRef<HTMLCanvasElement | null>(null);
    const  renderingContext     = useRef<CanvasRenderingContext2D | null>(null);


    useEffect(() => {
        if (!canvasRef.current) {
            setMatchState("Error canvasRef not initiate correctly!!");
            return ;
        }
        
        renderingContext.current = canvasRef.current.getContext("2d");
        if (!renderingContext.current){
            setMatchState("Error fail to get the rendring context!!");
            return ;
        }

        return (synchronizePongState(
            {
                connection: connection,
                context: renderingContext.current!,
                setScore: setScore,
                matchState: matchState,
                setMatchState: setMatchState
            })
        );
    }, [matchState])

    return (
        <div className="relative">
            <ScoreBar score={score} match={match} />
            <div className="flex flex-col w-9/10 m-auto my-4">
                <canvas 
                    width="700" height="400" ref={canvasRef} 
                    className="border rounded w-1/1 aspec-[7/4] m-auto"
                >Your browser does not support HTML canvas API!!</canvas>
                {(matchState === "pause") && <CounterDown />}
                {(matchState === "done") && <Winner score={score} match={match}/>}
            </div>
            <button
                className="block border rounded w-1/3 my-4 p-4 m-auto"
                onClick={() => {
                    if (matchState === "going") {
                        connection.send(JSON.stringify({
                            type: "leave",
                            data: true
                        }));
                    }
                    navigate("/dashboard/games/pingpong/remote");
                }}
            >Leave Match</button>
        </div>    
    )
}