import type { Pieces, Position } from '../types';

type WebSocketMessage = {
    type:
        | 'matchmaking'
        | 'leaveMatchmaking'
        | 'syncBoard'
        | 'chat'
        | 'reconnect'
        | 'checkmate'
        | 'rematchRequest'
        | 'rematchAccept'
        | 'rematchDecline';
    // prevMove carries both origin and destination so clients can highlight both squares
    prevMove?: { from: Position; to: Position } | null;
    roomId?: string;
    board?: any[];
    currentTurn?: 'WHITE' | 'BLACK';
    turns?: number;
    text?: string;
    winner?: 'WHITE' | 'BLACK' | 'DRAW';
};

class ChessWebSocket {
    private ws: WebSocket | null = null;
    private roomId: string | null = null;
    private myTeam: 'WHITE' | 'BLACK' | null = null;
    private messageHandlers: Map<string, Function[]> = new Map();

    connect(url: string) {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('Connected to chess server');
            this.emit('connected');
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                console.error('Message format is not correct:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected from socket');
            this.emit('disconnected');
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.emit('error', error);
        };
    }

    matchmaking() {
        this.send({ type: 'matchmaking' });
    }

    syncBoard(
        board: Pieces[],
        currentTurn: 'WHITE' | 'BLACK',
        turns: number,
        prevMove: { from: Position; to: Position } | null
    ) {
        if (this.roomId) {
            this.send({
                type: 'syncBoard',
                board,
                currentTurn,
                turns,
                prevMove,
            });
        }
    }

    reconnect(url: string) {
        if (!this.roomId) return;
        this.connect(url);
        this.send({ type: 'reconnect', roomId: this.roomId });
    }

    sendChat(text: string) {
        this.send({ type: 'chat', text });
    }

    announceCheckmate(winner: 'WHITE' | 'BLACK' | 'DRAW') {
        this.send({ type: 'checkmate', winner });
    }

    on(event: string, handler: Function) {
        if (!this.messageHandlers.has(event)) {
            this.messageHandlers.set(event, []);
        }
        this.messageHandlers.get(event)!.push(handler);
    }

    off(event: string, handler?: Function) {
        const handlers = this.messageHandlers.get(event);
        if (handlers) {
            if (handler) {
                const index = handlers.indexOf(handler);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
            } else {
                this.messageHandlers.set(event, []);
            }
        }
    }

    private emit(event: string, data?: any) {
        const handlers = this.messageHandlers.get(event);
        if (handlers) {
            handlers.forEach((handler) => handler(data));
        }
    }

    private handleMessage(message: any) {
        switch (message.type) {
            case 'roomCreated':
                this.roomId = message.roomId;
                this.myTeam = message.yourTeam;
                this.emit('roomCreated', {
                    roomId: message.roomId,
                    myTeam: message.yourTeam,
                });
                break;
            case 'gameStart':
                this.myTeam = message.yourTeam;
                this.roomId = message.roomId;
                this.emit('gameStart', {
                    myTeam: message.yourTeam,
                    opponentConnected: true,
                    roomId: message.roomId,
                });
                break;

            case 'syncBoard':
                this.emit('boardUpdate', {
                    board: message.board,
                    currentTurn: message.currentTurn,
                    turns: message.turns,
                    fromPlayer: message.fromPlayer,
                    prevMove: message.prevMove,
                });
                break;
            case 'chatMessage':
                this.emit('chatMessage', {
                    from: message.from,
                    text: message.text,
                    timestamp: message.timestamp,
                });
                break;
            case 'opponentDisconnected':
                this.emit('opponentDisconnected');
                break;
            case 'gameOver':
                this.emit('gameOver', {
                    winner: message.winner,
                    message: message.message,
                });
                break;
            case 'rematchOffer':
                this.emit('rematchOffer');
                break;
            case 'rematchPending':
                this.emit('rematchPending');
                break;
            case 'rematchDeclined':
                this.emit('rematchDeclined');
                break;
            case 'error':
                this.emit('error', message.message);
                break;
        }
    }

    private send(data: WebSocketMessage) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    getRoomId(): string | null {
        return this.roomId;
    }

    getMyTeam(): 'WHITE' | 'BLACK' | null {
        return this.myTeam;
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    leaveMatchmaking() {
        this.send({ type: 'leaveMatchmaking' });
    }

    requestRematch() {
        this.send({ type: 'rematchRequest' });
    }

    acceptRematch() {
        this.send({ type: 'rematchAccept' });
    }

    declineRematch() {
        this.send({ type: 'rematchDecline' });
    }
}

export const chessSocket = new ChessWebSocket();
