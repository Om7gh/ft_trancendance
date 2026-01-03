import { useContext, useEffect, useState } from 'react';
import { chessSocket } from '../classes/chessWebsocket';
import { useChessStore } from '../store/useChessStore';
import { toast } from 'react-toastify';
import type { ChatMessageData, Pieces, Position } from '../types';
import type { BoardUpdateData } from '../types';
import { GlobalContext } from '@/App';
import type { OnlineState } from '@/types/gameTypes';

export function useOnlineChess() {
  const gameOverRef = { current: false } as { current: boolean };
  const { user } = useContext(GlobalContext);
  const [state, setState] = useState<OnlineState>({
    roomId: null,
    myTeam: null,
    opponentConnected: false,
    opponentName: null,
    gameOver: null,
    rematch: { incomingOffer: false, requested: false, declined: false },
  });
  useEffect(() => {
    if (!user?.username) return;
    const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProto}://${window.location.host}/game/chess?playerId=${encodeURIComponent(user.username)}`;
    chessSocket.connect(wsUrl);
    chessSocket.on('connected', () => {
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
          opponentName: null,
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
        opponentName,
      }: {
        myTeam: 'WHITE' | 'BLACK' | 'DRAW' | null;
        opponentConnected: boolean;
        roomId: string;
        opponentName?: string | null;
      }) => {
        setState((prev) => ({
          ...prev,
          myTeam:
            myTeam === 'WHITE' || myTeam === 'BLACK' ? myTeam : prev.myTeam,
          opponentConnected,
          roomId: roomId ?? prev.roomId,
          opponentName: opponentName ?? prev.opponentName,
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
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    chessSocket.on('disconnected', () => {
      setState((prev) => ({ ...prev }));
    });

    chessSocket.on('error', (msg: string) => {
      toast.error(msg)
    });

    chessSocket.on(
      'gameOver',
      ({ winner, message }: { winner: string; message: string }) => {
        if (gameOverRef.current) {
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

      chessSocket.disconnect();
    };
  }, [user?.username]);

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
      myTeam: null,
      gameOver: null,
      opponentConnected: false,
    }));
    chessSocket.clearRoom();
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
