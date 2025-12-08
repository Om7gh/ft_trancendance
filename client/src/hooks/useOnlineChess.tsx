import { useEffect, useState } from 'react';
import { chessSocket } from '../classes/chessWebsocket';
import { useChessStore } from '../store/useChessStore';
import { toast } from 'react-toastify';
import type { ChatMessageData, Pieces, Position } from '../types';
import type { BoardUpdateData } from '../types';

interface OnlineState {
  roomId: string | null;
  myTeam: 'WHITE' | 'BLACK' | null;
  opponentConnected: boolean;
  gameOver: { winner: string; message: string } | null;
  rematch: {
    incomingOffer: boolean;
    requested: boolean;
    declined: boolean;
  };
}

export function useOnlineChess() {
  const gameOverRef = { current: false } as { current: boolean };
  const [state, setState] = useState<OnlineState>({
    roomId: null,
    myTeam: null,
    opponentConnected: false,
    gameOver: null,
    rematch: { incomingOffer: false, requested: false, declined: false },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('playerId') || localStorage.getItem('playerId');
    const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const baseWs = `${wsProto}://${window.location.host}/game/chess`;
    const wsUrl = pid
      ? `${baseWs}?playerId=${encodeURIComponent(pid)}`
      : baseWs;
    chessSocket.connect(wsUrl);

    chessSocket.on('connected', () => {
      console.log('✅ Connected to server');
      setState((prev) => ({ ...prev }));
    });

    chessSocket.on(
      'roomCreated',
      ({
        roomId,
        myTeam,
      }: {
        roomId: string | null;
        myTeam: 'WHITE' | 'BLACK' | null;
      }) => {
        setState({
          roomId,
          myTeam,
          opponentConnected: false,
          gameOver: null,
          rematch: {
            incomingOffer: false,
            requested: false,
            declined: false,
          },
        });
        useChessStore.setState({ currentTurn: 'WHITE', turns: 1 });
        gameOverRef.current = false;
        useChessStore.setState({ prevMove: null });
      }
    );

    chessSocket.on(
      'gameStart',
      ({
        myTeam,
        opponentConnected,
        roomId,
      }: {
        myTeam: 'WHITE' | 'BLACK' | 'DRAW' | null;
        opponentConnected: boolean;
        roomId: string;
      }) => {
        setState((prev) => ({
          ...prev,
          myTeam:
            myTeam === 'WHITE' || myTeam === 'BLACK' ? myTeam : prev.myTeam,
          opponentConnected,
          roomId: roomId ?? prev.roomId,
          gameOver: null,
          rematch: {
            incomingOffer: false,
            requested: false,
            declined: false,
          },
        }));
        useChessStore.setState({ currentTurn: 'WHITE', turns: 1 });
        gameOverRef.current = false;
        useChessStore.setState({ prevMove: null });
      }
    );

    chessSocket.on('boardUpdate', (data: BoardUpdateData) => {
      window.dispatchEvent(new CustomEvent('syncBoard', { detail: data }));
    });

    chessSocket.on('chatMessage', (data: ChatMessageData) => {
      window.dispatchEvent(new CustomEvent('chatMessage', { detail: data }));
    });

    chessSocket.on('opponentDisconnected', () => {
      setState((prev) => ({ ...prev, opponentConnected: false }));
      toast.error('Opponent disconnected', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    chessSocket.on('disconnected', () => {
      toast.warn('You have been disconnected. Attempting to reconnect...', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setState((prev) => ({ ...prev }));

      setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pid =
          urlParams.get('playerId') || localStorage.getItem('playerId');
        const wsHost =
          (import.meta as any).env?.VITE_WS_HOST || window.location.hostname;
        const wsPort = (import.meta as any).env?.VITE_WS_PORT || '9000';
        const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const baseWs = `${wsProto}://${wsHost}:${wsPort}/game/chess`;
        const wsUrl = pid
          ? `${baseWs}?playerId=${encodeURIComponent(pid)}`
          : baseWs;
        chessSocket.reconnect(wsUrl);
      }, 1000);
    });

    chessSocket.on('error', (msg: string) => {
      console.error('Server error:', msg);
    });

    chessSocket.on(
      'gameOver',
      ({ winner, message }: { winner: string; message: string }) => {
        if (gameOverRef.current) {
          console.log('Suppressing stale gameOver during matchmaking');
          return;
        }
        setState((prev) => ({
          ...prev,
          gameOver: { winner, message },
        }));
        toast.info(`Game Over! ${message}`, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    );

    chessSocket.on('enterMatchmaking', () => {
      console.log('enterMatchmaking event received');
      setState((prev) => {
        const newState = {
          ...prev,
          gameOver: null,
          rematch: {
            incomingOffer: false,
            requested: false,
            declined: false,
          },
        };
        return newState;
      });
      gameOverRef.current = true;
    });

    chessSocket.on('rematchOffer', () => {
      setState((prev) => ({
        ...prev,
        rematch: {
          incomingOffer: true,
          requested: false,
          declined: false,
        },
      }));
    });

    chessSocket.on('rematchPending', () => {
      setState((prev) => ({
        ...prev,
        rematch: {
          incomingOffer: false,
          requested: true,
          declined: false,
        },
      }));
    });

    chessSocket.on('rematchDeclined', () => {
      setState((prev) => ({
        ...prev,
        rematch: {
          incomingOffer: false,
          requested: false,
          declined: true,
        },
      }));
    });

    return () => {
      chessSocket.off('connected');
      chessSocket.off('roomCreated');
      chessSocket.off('gameStart');
      chessSocket.off('boardUpdate');
      chessSocket.off('chatMessage');
      chessSocket.off('opponentDisconnected');
      chessSocket.off('disconnected');
      chessSocket.off('gameOver');
      chessSocket.off('enterMatchmaking');
      chessSocket.off('rematchOffer');
      chessSocket.off('rematchPending');
      chessSocket.off('rematchDeclined');
      chessSocket.off('error');
    };
  }, []);

  const enterMatchmaking = () => chessSocket.matchmaking();
  const leaveMatchmaking = () => chessSocket.leaveMatchmaking();
  const syncBoard = (
    board: Pieces[],
    currentTurn: 'WHITE' | 'BLACK',
    turns: number,
    prevMove: { from: Position; to: Position } | null
  ) => {
    useChessStore.setState({ prevMove: prevMove });
    chessSocket.syncBoard(board, currentTurn, turns, prevMove);
  };
  const sendChat = (text: string) => chessSocket.sendChat(text);
  const requestRematch = () => {
    setState((prev) => ({
      ...prev,
      rematch: { incomingOffer: false, requested: true, declined: false },
    }));
    chessSocket.requestRematch();
  };
  const acceptRematch = () => {
    setState((prev) => ({
      ...prev,
      rematch: { incomingOffer: false, requested: true, declined: false },
    }));
    chessSocket.acceptRematch();
  };
  const declineRematch = () => {
    setState((prev) => ({
      ...prev,
      rematch: { incomingOffer: false, requested: false, declined: true },
    }));
    chessSocket.declineRematch();
  };

  const clearRoom = () => {
    setState((prev) => ({
      ...prev,
      roomId: null,
      gameOver: null,
      opponentConnected: false,
    }));
    useChessStore.setState({ currentTurn: 'WHITE', turns: 1 });
  };

  return {
    ...state,
    enterMatchmaking,
    leaveMatchmaking,
    syncBoard,
    sendChat,
    clearRoom,
    requestRematch,
    acceptRematch,
    declineRematch,
    rematch: state.rematch,
    isConnected: chessSocket.isConnected(),
  };
}
