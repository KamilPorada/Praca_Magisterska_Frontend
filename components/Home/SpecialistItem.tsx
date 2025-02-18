import Image, { StaticImageData } from "next/image";

interface SpecialistItemProps {
  image: StaticImageData;
  title: string;
  group: string;
  description: string;
}

const SpecialistItem: React.FC<SpecialistItemProps> = ({ image, title, group, description }) => {
  return (
    <div className="border-gray-900 border rounded-lg overflow-hidden bg-secondaryColor text-white shadow-md flex flex-col">
      <div className="relative w-full aspect-[1]"> {/* Proporcje obrazka zamiast konkretnych wymiarów */}
        <Image src={image} alt={title} layout="fill" objectFit="cover" className="rounded-t-lg" />
        <p className="absolute bottom-0 bg-mainColor py-1 px-2 uppercase text-sm font-semibold text-white">{group}</p>
      </div>
      <div className="flex flex-col flex-1 justify-between p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="font-thin mt-2 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default SpecialistItem;
