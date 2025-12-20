import { useCallback, useEffect, useState } from 'react';
import { chessSocket } from '../classes/chessWebsocket';

type RemoteChatMessage = {
    from: string;
    text: string;
    timestamp: number;
};

export type ChatMessage = {
    id: string;
    from: string;
    text: string;
    timestamp: number;
    mine?: boolean;
};

export default function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const handler = (e: Event) => {
            const ev = e as CustomEvent<RemoteChatMessage>;
            const data = ev.detail;
            if (!data) return;
            setMessages((prev) => [
                ...prev,
                {
                    id: `${data.from}-${data.timestamp}-${prev.length}`,
                    from: data.from,
                    text: data.text,
                    timestamp: data.timestamp,
                    mine: false,
                },
            ]);
        };

        window.addEventListener('chatMessage', handler as EventListener);
        return () =>
            window.removeEventListener('chatMessage', handler as EventListener);
    }, []);

    const sendMessage = useCallback((text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const timestamp = Date.now();
        chessSocket.sendChat(trimmed);

        setMessages((prev) => [
            ...prev,
            {
                id: `me-${timestamp}-${prev.length}`,
                from: 'me',
                text: trimmed,
                timestamp,
                mine: true,
            },
        ]);
    }, []);

    return { messages, sendMessage };
}
