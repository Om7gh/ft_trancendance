import { useReducer } from "react";
import { AboutData } from "../../utils/About";
import { AboutUs, Why, Join } from "@/assets";
interface AboutItem {
  title: string;
  content: string;
}

interface State {
  data: AboutItem[];
  i: number;
}

type Action =
  | { type: "data/inc" }
  | { type: "data/dec" }
  | { type: "data/set"; payload: number };

const initialState: State = {
  data: AboutData,
  i: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "data/inc":
      return {
        ...state,
        i: (state.i + 1) % state.data.length,
      };
    case "data/dec":
      return {
        ...state,
        i: (state.i - 1 + state.data.length) % state.data.length,
      };
    case "data/set":
      return {
        ...state,
        i: action.payload,
      };
    default:
      throw new Error("Invalid action type");
  }
}

export default function About() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, i } = state;

  return (
    <section
      id="About"
      className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="relative text-center mb-12 md:mb-24">
        <span className="absolute left-0 right-0 mx-auto text-6xl sm:text-7xl md:text-8xl text-slate-300 opacity-5 font-bold pointer-events-none select-none">
          About
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold relative z-10 bg-gradient-to-r from-teal-400 to-orange-300 bg-clip-text text-transparent">
          About PingPop
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
        <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
          <h3 className="text-2xl sm:text-3xl font-semibold text-teal-400">
            {data[i].title}
          </h3>
          <p className="text-slate-200 sm:tracking-wide leading-relaxed text-base sm:text-lg font-light">
            {data[i].content}
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6 md:mt-8">
            <button
              onClick={() => dispatch({ type: "data/dec" })}
              className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={i === 0}
              aria-label="Previous">
              Previous
            </button>
            <button
              onClick={() => dispatch({ type: "data/inc" })}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={i === data.length - 1}
              aria-label="Next">
              Next
            </button>
          </div>
        </div>

        {/* Image/Illustration */}
        <div className="flex items-center justify-center order-1 lg:order-2">
          <div className="w-full h-64 sm:h-80 md:h-96 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
            <img
              src={i === 0 ? Why : i === 1 ? AboutUs : i === 2 ? Join : ""}
              alt={
                i === 0
                  ? "Why PingPop"
                  : i === 1
                  ? "About Us"
                  : i === 2
                  ? "Join Community"
                  : "PingPop image"
              }
              className="w-full h-full object-cover object-center transition-opacity duration-300"
            />
          </div>
        </div>
      </div>

      {/* Indicator Dots */}
      <div className="flex justify-center gap-2 mt-8 md:mt-12">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => dispatch({ type: "data/set", payload: index })}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index
                ? "bg-teal-500 scale-125"
                : "bg-slate-500 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-teal-500/10 blur-3xl -z-10" />
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-500/10 blur-3xl -z-10" />
    </section>
  );
}
