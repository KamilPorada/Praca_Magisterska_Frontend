const SectionTitle: React.FC<{ title: string }> = (props) => {
  return (
    <div className="relative flex">
      <span className="absolute left-0 w-[3px] md:w-[4px] h-[40px] bg-mainColor"></span>
      <h2 className="pl-4 pt-1 text-center text-white text-lg md:text-xl lg:text-2xl uppercase font-semibold">
        {props.title}
      </h2>
    </div>
  );
};

export default SectionTitle;
