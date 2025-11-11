type title = {
  title: string;
};

export default function Titles({ title }: title) {
  return (
    <div className="my-5">
      <h2 className="text-[2vmax] bg-gradient-to-l from-teal-500 to-orange-500 bg-clip-text text-transparent w-fit text-center">
        {title}
      </h2>
      <div className="bg-gradient-to-l from-teal-500 to-orange-500 w-20 h-2"></div>
    </div>
  );
}
