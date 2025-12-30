import React, { useEffect, useRef, useState, type JSX } from 'react';
import useChat, { type ChatMessage } from '../hooks/useChat';

export default function MiniChat(): JSX.Element {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput('');
  };

  return (
    <div className=" h-44 md:h-96 flex flex-col bg-slate-900/80  border border-slate-700 shadow-sm">
      <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-100">Chat</h4>
        <span className="text-xs text-slate-400">Private</span>
      </div>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        className="flex-1 p-3 overflow-y-auto space-y-3"
      >
        {messages.map((msg: ChatMessage) => (
          <div
            key={msg.id}
            className={`flex items-end ${
              msg.mine ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={` px-3 py-2  wrap-break-word text-sm ${
                msg.mine
                  ? 'bg-neon text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-100 rounded-bl-sm'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-xs">
                  {msg.mine ? 'You' : msg.from}
                </span>
                <span className="text-[10px] text-slate-400 ml-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-1 text-sm">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="px-3 py-2 border-t border-slate-700 flex gap-2 items-center"
      >
        <input
          className="flex-1 px-3 py-2  bg-slate-800 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-neon/80 w-full"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-4 py-2  bg-neon/80 text-white font-semibold disabled:opacity-60"
          disabled={input.trim() === ''}
        >
          Send
        </button>
      </form>
    </div>
  );
}
