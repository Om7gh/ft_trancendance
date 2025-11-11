import { useMobile } from "@/hooks/useMobile";
import { LuSend } from "react-icons/lu";

export default function Messages() {
  const isMobile = useMobile();
  return (
    <div className="h-[80vh] bg-slate-800/40 p-3 rounded-xl font-second tracking-widest">
      <ChatHeader />
      <ChatMessages isMobile={isMobile} />
      <SendMessage />
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="bg-slate-800/50 py-10 text-center text-slate-200 tracking-wider border-b-[0.5px] border-b-teal-100 h-[10%] text-2xl">
      <h3>
        You are talking with{" "}
        <span className="text-2xl text-teal-500">Ilyas</span> now
      </h3>
    </div>
  );
}

function ChatMessages({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="h-[80%] shadow border-slate-200 overflow-scroll">
      <div
        className={`text-sm ${
          isMobile ? "max-w-[100%]" : "max-w-[40%]"
        } bg-slate-950/30 p-4 m-4 rounded-3xl text-slate-100 tracking-widest`}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid
        voluptas, recusandae tenetur vel animi, distinctio sequi nisi harum
        labore ipsum optio rem! Voluptatem cum
      </div>
      <div
        className={`text-sm ${
          isMobile ? "max-w-[100%]" : "max-w-[40%]"
        } bg-teal-500/50 p-4 m-4 rounded-3xl text-slate-100 tracking-widest ml-auto`}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid
        voluptas, recusandae tenetur vel animi, distinctio sequi nisi harum
        labore ipsum optio rem! Voluptatem cum
      </div>
    </div>
  );
}

function SendMessage() {
  return (
    <div className="h-[10%] flex items-center px-5 gap-3">
      <input
        type="text"
        placeholder="type your message..."
        className="w-full shadow p-5 outline-none border border-slate-700 rounded-full text-slate-200 tracking-wider text-xl focus:ring-2 focus:ring-offset-orange-500 focus:ring-orange-500 focus:outline-0"
      />
      <LuSend className="text-3xl text-teal-500 border rounded-full p-4 w-15 h-15 cursor-pointer hover:bg-teal-600 hover:text-slate-200" />
    </div>
  );
}
