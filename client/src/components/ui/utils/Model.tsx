export default function Model({ children }) {
  return (
    <div className="w-screen h-screen bg-slate-950/50 backdrop-blur-xl fixed top-0 left-0 z-50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/80  z-40">
        {children}
      </div>
    </div>
  );
}
