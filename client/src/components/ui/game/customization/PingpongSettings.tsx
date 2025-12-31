import { usePutPong } from "@/services/user/usePutPong";
import { type FormEvent } from "react";

function PingpongSettings({close} : {close: () => void}) {

  const mutatePong = usePutPong()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formdData = new FormData(e.currentTarget);
    const data = {
      ball_color          : formdData.get("ball") as string,
      left_paddle_color   : formdData.get("leftPaddle") as string,
      right_paddle_color  : formdData.get("rightPaddle") as string,
      table_edges_color   : formdData.get("table") as string
    }
    mutatePong.mutate(data)
    close()
  }

  return <div className="container mx-auto max-w-4xl px-4 py-8">
    <div className="w-full max-w-2xl mx-auto bg-slate-950/30 text-center px-6 py-4  mb-8">
      <h2 className="bg-linear-to-l from-violet-500 to-neon bg-clip-text text-transparent text-2xl font-semibold">Pong Customization</h2>
    </div>

    <form className="flex flex-col gap-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 bg-slate-950/20 shadow-lg shadow-slate-950 p-6 ">
        <h2 className="text-center text-xl font-semibold text-violet-200 mb-2">Style Paddles</h2>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="text-violet-200 text-lg">Left Paddle</label>
          <input type="color" id="leftPaddle" name="leftPaddle" defaultValue="#ff0ff0" className="w-full h-12 cursor-pointer rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="text-violet-200 text-lg">Right Paddle</label>
          <input type="color" id="rightPaddle" name="rightPaddle" defaultValue="#0f550f" className="w-full h-12 cursor-pointer rounded" />
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-slate-950/20 shadow-lg shadow-slate-950 p-6 ">
        <h2 className="text-center text-xl font-semibold text-violet-200 mb-2">Style Ball and Table</h2>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="text-violet-200 text-lg">Ball</label>
          <input type="color" id="ball" name="ball" defaultValue="#ffffff" className="w-full h-12 cursor-pointer rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="text-violet-200 text-lg">Table</label>
          <input type="color" id="table" name="table" defaultValue="#ff00ff" className="w-full h-12 cursor-pointer rounded" />
        </div>
      </div>
      <button
          type="submit"
          className="w-52 mx-auto bg-linear-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-950 text-white font-semibold text-xl px-6 py-3  shadow-xl transition-all duration-300 hover:scale-105"
      >
        Save
      </button>
    </form>

  </div>;
}

export default PingpongSettings;
