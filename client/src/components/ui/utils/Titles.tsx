type title = {
  title: string;
  icon: React.ReactNode;
};

export default function Titles({ title, icon }: title) {
  return (
    <div className="my-5 absolute">
      <div className="text-5xl text-violet-500/80">{icon}</div>
      <h2 className="text-[1.5vmax] bg-gradient-to-l from-violet-500 to-neon bg-clip-text text-transparent w-fit text-center">
        {title}
      </h2>
      <div className="bg-gradient-to-l from-violet-500 to-neon w-56 h-2"></div>
    </div>
  );
}
